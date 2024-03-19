import * as React from 'react';
import { Trans } from 'react-i18next';
import { Done } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import '@presentation/login.scss';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { contextStore } from '@presentation/store/contextStore';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';
import { REGEX } from '../common/REGEX';

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
