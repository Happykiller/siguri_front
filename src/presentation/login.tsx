import * as React from 'react';
import { Trans } from 'react-i18next';
import { Done } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';

import '@presentation/login.scss';
import { Footer } from '@presentation/footer';
import inversify from '@src/common/inversify';
import { contextStore } from '@presentation/contextStore';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';

export const Login = () => {
  const navigate = useNavigate();
  const [currentLogin, setCurrentLogin] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [currentMsg, setCurrentMsg] = React.useState('');

  let errorMessage = <div></div>;
  if(currentMsg) {
    errorMessage = <div><Trans>login.error</Trans><Trans>{currentMsg}</Trans></div>
  }

  const handleClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const response:AuthUsecaseModel = await inversify.authUsecase.execute({
      login: currentLogin,
      password: currentPassword
    });
    if (response.data) {
      contextStore.setState({ 
        id: response.data.id,
        code: response.data.code,
        access_token: response.data.access_token,
        name_first: response.data.name_first,
        name_last: response.data.name_last,
      });
      navigate('/');
    } else {
      setCurrentMsg(response.message);
    }
  }

  return (
    <div className="login">
      <div className='title'>
        <Trans>login.title</Trans>
      </div>
      <div>
        <form
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
            <TextField
              sx={{ marginRight:1}}
              label={<Trans>login.login</Trans>}
              variant="standard"
              size="small"
              onChange={(e) => { 
                e.preventDefault();
                setCurrentLogin(e.target.value);
              }}
            />
            <TextField
              sx={{ marginRight:1}}
              label={<Trans>login.password</Trans>}
              variant="standard"
              size="small"
              onChange={(e) => { 
                e.preventDefault();
                setCurrentPassword(e.target.value);
              }}
            />
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<Done />}
              disabled={!(currentLogin.length > 3 && currentPassword.length > 3)}
            ><Trans>common.done</Trans></Button>
            {errorMessage}
          </Box>
        </form>
      </div>
      <Footer />
    </div>
  )
};
