import * as React from 'react';
import { Done } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from 'react-router-dom';
import { client } from '@passwordless-id/webauthn';
import { Trans, useTranslation } from 'react-i18next';

import '@presentation/login.scss';
import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { passkeyStore } from '@presentation/store/passkeyStore';
import { contextStore } from '@presentation/store/contextStore';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const passkey = passkeyStore();
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

  const signPasskey = async () => {
    try {
      inversify.loggerService.debug('perform sign passkey with', passkey);
      const authentication = await client.authenticate([passkey.credential_id], passkey.challenge, {
        "authenticatorType": "auto",
        "userVerification": "required",
        "timeout": 60000
      });
      console.log(authentication);
      
      if (authentication) {
        const session = await inversify.authPasskeyUsecase.execute({
          ...authentication,
          user_code: passkey.user_code
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
              value: entity.value.toLowerCase(),
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
