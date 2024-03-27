import * as React from 'react';
import { Done } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import '@presentation/login.scss';
import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import PassKeyClientData from '@src/common/passKeyClientData';
import { contextStore } from '@presentation/store/contextStore';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';
import { PasskeyStoreModel, passkeyStore } from '@presentation/store/passkeyStore';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const passkey:PasskeyStoreModel = passkeyStore();
  const [qry, setQry] = React.useState({
    loading: null,
    data: null,
    error: null
  });
  const [formEntities, setFormEntities] = React.useState({
    login: {
      value: passkey.user_code??'',
      valid: passkey.user_code?true:false
    },
    password: {
      value: '',
      valid: false
    }
  });

  const handleClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.authUsecase.execute({
      login: formEntities.login.value,
      password: formEntities.password.value
    }).then((response:AuthUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        contextStore.setState({ 
          id: response.data.id,
          code: response.data.code,
          access_token: response.data.access_token,
          name_first: response.data.name_first,
          name_last: response.data.name_last,
        });
        navigate('/');
      } else {
        inversify.loggerService.debug(response.error);
        setQry(qry => ({
          ...qry,
          error: response.message
        }));
      }
    })
    .catch((error:any) => {
      setQry(qry => ({
        ...qry,
        error: error.message
      }));
    })
    .finally(() => {
      setQry(qry => ({
        ...qry,
        loading: false
      }));
    });
  }

  const getPasskeyCredential = async (challenge: string) => {
    const challengeBuffer = Uint8Array.from(challenge, (c) => c.charCodeAt(0));
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challengeBuffer,
      rpId: location.hostname,
      userVerification: "preferred",
      timeout: 60000,
    };
  
    return await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
  };

  const performLogin = async (challenge: string) => {
    try {
      const credential = await getPasskeyCredential(challenge);
      return credential;
    } catch (error) {
      inversify.loggerService.error(
        "performLogin, failed to get credential with error: ",
        error
      );
      return null;
    }
  };

  const parseClientData = (clientData: ArrayBuffer):PassKeyClientData => {
    // decode the clientDataJSON into a utf-8 string
    const utf8Decoder = new TextDecoder("utf-8");
    const decodedClientData = utf8Decoder.decode(clientData);
  
    // parse the string as an object
    const clientDataObj = JSON.parse(decodedClientData);
    return clientDataObj;
  };

  const extractData = (credential: Credential) => {
    const utf8Decoder = new TextDecoder("utf-8");
  
    const user_id = utf8Decoder.decode(
      // @ts-ignore
      credential.response.userHandle
    );

    let challenge;
    // @ts-ignore
    let clientData = parseClientData(credential.response.clientDataJSON);
    if (clientData !== null) {
      challenge = clientData.challenge;
    }

    inversify.loggerService.debug('Datas from passkey', {
      user_id: user_id,
      challenge: challenge
    });

    return {
      user_id: user_id,
      challenge: challenge
    }
  }

  const signPasskey = async () => {
    try {
      if (passkey.challenge_buffer !== null) {

        inversify.loggerService.debug('perform sign passkey with', passkey);
        const credential = await performLogin(passkey.challenge_buffer);

        if (credential !== null) {
          const datas = extractData(credential);

          const session = await inversify.authPasskeyUsecase.execute({
            user_code: passkey.user_code,
            user_id: datas.user_id,
            challenge: datas.challenge,
            challenge_buffer: passkey.challenge_buffer
          });

          if(session.message !== CODES.SUCCESS) {
            inversify.loggerService.error(session.error);
            throw new Error(session.message);
          }

          contextStore.setState({ 
            id: session.data.id,
            code: session.data.code,
            access_token: session.data.access_token,
            name_first: session.data.name_first,
            name_last: session.data.name_last
          });
          navigate('/');
        } else {
          inversify.loggerService.error("signIn, failed to perform Login.");
        }
      }
    } catch(e) {
      flash.open(t(`login.${e.message}`));
      inversify.loggerService.error(e.error);
    }
  
  };

  let form = <div></div>;
  if(qry.loading) {
    form = <div><Trans>common.loading</Trans></div>;
  } else {
    form = <form
    onSubmit={handleClick}
  >
    <Box
      display="flex"
      alignItems="center"
      sx={{ 
        flexDirection: 'column',
        gap: '10px;'
      }}
    >
      {/* Login */}
      <Input
        label={<Trans>login.login</Trans>}
        tooltip={<Trans>REGEX.LOGIN</Trans>}
        regex={REGEX.LOGIN}
        entity={formEntities.login}
        onChange={(entity:any) => { 
          setFormEntities({
            ... formEntities,
            login: {
              value: entity.value,
              valid: entity.valid
            }
          });
        }}
        require
        virgin
      />

      {/* Password */}
      <Input
        label={<Trans>login.password</Trans>}
        tooltip={<Trans>REGEX.PASSWORD</Trans>}
        regex={REGEX.PASSWORD}
        type='password'
        entity={formEntities.password}
        onChange={(entity:any) => { 
          setFormEntities({
            ... formEntities,
            password: {
              value: entity.value,
              valid: entity.valid
            }
          });
        }}
        require
        virgin
      />

      {/* Submit button */}
      <Button 
        type="submit"
        variant="contained"
        size="small"
        startIcon={<Done />}
        disabled={!(formEntities.login.valid && formEntities.password.valid)}
      ><Trans>common.done</Trans></Button>

      {/* Passkeys button */}
      <Button 
        variant="contained"
        size="small"
        startIcon={<KeyIcon />}
        disabled={!passkey.user_code}
        onClick={(e) => { 
          e.preventDefault();
          signPasskey();
        }}
      ><Trans>login.passkey</Trans></Button>
    </Box>
  </form>
  }

  let errorMessage = <div></div>;
  if(qry.error) {
    errorMessage = <div><Trans>login.{qry.error}</Trans></div>
  }

  return (
    <div className="login">
      <div className='title'>
        <Trans>login.title</Trans>
      </div>
      <div>
        {form}
      </div>
      <div>
        {errorMessage}
      </div>
      <Footer/>
    </div>
  )
};
