import * as React from 'react';
import { Trans } from 'react-i18next';
import { Done } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import '@presentation/login.scss';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { contextStore } from '@presentation/contextStore';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';

export const Login = () => {
  const navigate = useNavigate();
  const [qry, setQry] = React.useState({
    loading: null,
    data: null,
    error: null
  });
  const [currentLogin, setCurrentLogin] = React.useState('');
  const [passVisible, setPassVisible] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  
  const [formEntities, setFormEntities] = React.useState({
    field0: {
      value: '',
      valid: true
    },
    field1: {
      value: '',
      valid: false
    },
    field2: {
      value: '',
      valid: false
    },
    field3: {
      value: '',
      valid: false
    },
    field4: {
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
      login: currentLogin,
      password: currentPassword
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
    console.log('field1', formEntities.field1)
    console.log('field2', formEntities.field2)
    console.log('field3', formEntities.field3)
    console.log('field4', formEntities.field4)
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
      {/* Field 2 */}
      <Input
        label={<Trans>login.field2</Trans>}
        tooltip='Des lettres'
        entity={formEntities.field0}
      />

      {/* Field 1 => Require */}
      <Input
        label={<Trans>login.field1</Trans>}
        tooltip='Obligatoire'
        entity={formEntities.field1}
        onChange={(entity:any) => { 
          setFormEntities({
            ... formEntities,
            field1: {
              value: entity.value,
              valid: entity.valid
            }
          });
        }}
        require
      />
      
      {/* Field 2 */}
      <Input
        label={<Trans>login.field2</Trans>}
        regex='^([a-zA-Z])+$'
        tooltip='Des lettres'
        entity={formEntities.field2}
      />
      
      {/* Field 3 */}
      <Input
        label={<Trans>login.field3</Trans>}
        regex='^([0-9]){1,5}$'
        tooltip='Des nombres'
        type='number'
        entity={formEntities.field3}
      />
      
      {/* Field 4 */}
      <Input
        label={<Trans>login.field4</Trans>}
        regex='^([0-9]){1,5}$'
        tooltip='Des nombres'
        type='password'
        entity={formEntities.field4}
      />

      {/* Field Login */}
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
      
      {/* Field Password */}
      <TextField
        sx={{ marginRight:1}}
        label={<Trans>login.password</Trans>}
        variant="standard"
        size="small"
        autoComplete='false'
        type={(passVisible)?'text':'password'}
        onChange={(e) => { 
          e.preventDefault();
          setCurrentPassword(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment 
              position="end"
              onClick={(e) => { 
                e.preventDefault();
                setPassVisible(!passVisible);
              }}
              sx={{
                cursor: 'pointer'
              }}
            >
              {(passVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
            </InputAdornment>
          ),
        }}
      />

      {/* Submit button */}
      <Button 
        type="submit"
        variant="contained"
        size="small"
        startIcon={<Done />}
        disabled={!(currentLogin.length > 3 && currentPassword.length > 3)}
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
