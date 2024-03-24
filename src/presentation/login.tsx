import * as React from 'react';
import { Trans } from 'react-i18next';
import { Done } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from 'react-router-dom';

import '@presentation/login.scss';
import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { contextStore } from '@presentation/store/contextStore';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';

export const Login = () => {
  const navigate = useNavigate();
  const [qry, setQry] = React.useState({
    loading: null,
    data: null,
    error: null
  });
  
  const [formEntities, setFormEntities] = React.useState({
    login: {
      value: '',
      valid: false
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
      rpId: 'localhost',
      userVerification: "preferred",
      timeout: 60000,
    };
  
    return await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
  };

  const performLogin = async (challenge: string) => {
    console.log("⚈ ⚈ ⚈ performLogin ⚈ ⚈ ⚈");
    try {
      const credential = await getPasskeyCredential(challenge);
      console.log(" performLogin ✅ credential : ", credential);
      return credential;
    } catch (error) {
      console.log(
        "performLogin ❌  Failed to get credential with error : ",
        error
      );
      return null;
    }
  };

  const verifyUserId = (credential: Credential, userId: string): boolean => {
    console.log("⚈ ⚈ ⚈ Verifying UserId ⚈ ⚈ ⚈");
    const utf8Decoder = new TextDecoder("utf-8");
  
    const decodedUserIdHandle = utf8Decoder.decode(
      // @ts-ignore
      credential.response.userHandle
    );
    console.log("✅ decodedUserIdHandle : ", decodedUserIdHandle);
  
    if (decodedUserIdHandle !== userId) {
      console.log("❌ The userId does not match. Failed Login.");
      return false;
    } else {
      console.log("✅  Verified UserId");
      // @ts-ignore
      return true;
    }
  };

  interface UserAccount {
    userId: string;
    username: string;
    displayName: string;
    challengeBuffer: string;
    challenge: string;
  }

  interface PassKeyClientData {
    type: string;
    challenge: string;
    origin: string;
    crossOrigin: boolean;
  }

  const parseClientData = (clientData: ArrayBuffer) => {
    // decode the clientDataJSON into a utf-8 string
    const utf8Decoder = new TextDecoder("utf-8");
    const decodedClientData = utf8Decoder.decode(clientData);
  
    // parse the string as an object
    const clientDataObj = JSON.parse(decodedClientData);
    return clientDataObj as PassKeyClientData;
  };

  const verifyClientData = (
    credential: Credential,
    userAccount: UserAccount
  ): boolean => {
    //@ts-ignore
    let clientData = parseClientData(credential.response.clientDataJSON);
    if (clientData !== null) {
      console.log("✅ We have performed the login.");
      console.log("✅ clientData : ", clientData);
      console.log("⚈ ⚈ ⚈ Verifying Challenge ⚈ ⚈ ⚈");
      return validatePassKey(userAccount.challenge, clientData.challenge);
    } else {
      console.log("❌ Failed to perform Login. Client data json is null.");
      return false;
    }
  };

  const validatePassKey = (storedChallenge: string, clientChallenge: string) => {
    return storedChallenge === clientChallenge;
  };

  const signIn = async () => {

    //Todo
    /*
      1 - If localstorage {
          user_code
          challenge_buffer
        }
        Display bt passkey

      2 - If formEntities.login.value match with api a passkey on user_code get {
          user_code
          challenge_buffer
        }
        Display bt passkey

      3 - performLogin get Credential {
          user_id
          challenge
        }

      4 - Perform signin with {
          user_code
          user_id
          challenge
          challenge_buffer
        }
    */

    console.log("⚈ ⚈ ⚈ signIn ⚈ ⚈ ⚈");
    // Get the account related to the username.
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // MARK: THIS SHOULD BE DONE ON THE BACKEND
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userAccount = {
      "userId": "65da139c45e382cdb661379f",
      "username": "faro",
      "displayName": "fabrice rosito",
      "challengeBuffer": "aNNmk8cAfdV4orGZ",
      "challenge": "YU5ObWs4Y0FmZFY0b3JHWg"
    };
    console.log("⚈ ⚈ ⚈ getUserAccount ⚈ ⚈ ⚈");
    if (userAccount !== null) {
      console.log(
        "Get User Account ✅ There is a match for that username : ",
        userAccount
      );
      // Login with the details.
      // This part remains on the front-end in production.
      const credential = await performLogin(userAccount.challengeBuffer);

      if (credential !== null) {
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // MARK: THIS SHOULD BE DONE ON THE BACKEND
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        /*
          This functionality confirms that theres a credentials are valid
          and that they match the details related to the users account.
        */
        switch (verifyUserId(credential, userAccount.userId)) {
          case true:
            switch (verifyClientData(credential, userAccount)) {
              case true:
                console.log("✅ You have succesfully logged in.");
                break;
              case false:
                console.log("❌ The challenge does not match.");
                break;
            }
            break;
          case false:
            break;
        }
      } else {
        console.log(
          " signIn ❌ Failed to perform Login as credential does not exist."
        );
      }
    } else {
      console.log(" signIn ❌ There is no match for that username.");
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
        onClick={(e) => { 
          e.preventDefault();
          signIn();
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
