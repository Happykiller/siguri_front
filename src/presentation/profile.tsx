import * as React from 'react';
import { Button, Divider } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Chip, Grid, InputAdornment, TextField } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@src/presentation/molecule/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@src/presentation/molecule/footer';
import inversify from '@src/common/inversify';
import { FlashStore, flashStore} from '@src/presentation/molecule/flash';
import { ContextStoreModel, contextStore } from '@presentation/contextStore';
import { UpdPasswordUsecaseModel } from '@usecase/updPassword/updPassword.usecase.model';

export const Profile = () => {
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const context:ContextStoreModel = contextStore();
  const inital = {
    oldVisible: false,
    oldValue: '',
    newVisible: false,
    newValue: '',
    confVisible: false,
    confValue: ''
  };
  const [uptPassword, setUptPassword] = React.useState(inital);
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const update = () => {
    setQry(qry => ({
      ...qry,
      error: null,
      loading: true
    }));

    inversify.updPasswordUsecase.execute({
      old_value: uptPassword.oldValue,
      new_value: uptPassword.newValue,
      conf_value: uptPassword.confValue
    })
      .then((response:UpdPasswordUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('profile.passwordUpdated'));
          setUptPassword(inital);
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

  let content = <div></div>;
  let errorMessage = <div></div>;

  if (qry.error) {
    errorMessage = <div><Trans>profile.{qry.error}</Trans></div>
  }

  if (qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else {
    content = <form>
      <Grid
        container
      >
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field old password */}
          <TextField
            sx={{ marginRight: 1 }}
            label={<Trans>profile.oldPassword</Trans>}
            variant="standard"
            size="small"
            autoComplete='off'
            type={(uptPassword.oldVisible)?'text':'password'}
            onChange={(e) => { 
              e.preventDefault();
              setUptPassword({
                ... uptPassword,
                oldValue: e.target.value
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment 
                  position="end"
                  onClick={(e) => { 
                    e.preventDefault();
                    setUptPassword({
                      ... uptPassword,
                      oldVisible: !uptPassword.oldVisible
                    });
                  }}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  {(uptPassword.oldVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field new password */}
          <TextField
            sx={{ marginRight: 1 }}
            label={<Trans>profile.newPassword</Trans>}
            variant="standard"
            size="small"
            autoComplete='off'
            type={(uptPassword.newVisible)?'text':'password'}
            onChange={(e) => { 
              e.preventDefault();
              setUptPassword({
                ... uptPassword,
                newValue: e.target.value
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment 
                  position="end"
                  onClick={(e) => { 
                    e.preventDefault();
                    setUptPassword({
                      ... uptPassword,
                      newVisible: !uptPassword.newVisible
                    });
                  }}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  {(uptPassword.newVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field confirm password */}
          <TextField
            sx={{ marginRight: 1 }}
            label={<Trans>profile.confPassword</Trans>}
            variant="standard"
            size="small"
            autoComplete='off'
            type={(uptPassword.confVisible)?'text':'password'}
            onChange={(e) => { 
              e.preventDefault();
              setUptPassword({
                ... uptPassword,
                confValue: e.target.value
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment 
                  position="end"
                  onClick={(e) => { 
                    e.preventDefault();
                    setUptPassword({
                      ... uptPassword,
                      confVisible: !uptPassword.confVisible
                    });
                  }}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  {(uptPassword.confVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Submit button */}
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<SystemUpdateAltIcon />}
            disabled={!(uptPassword.newValue.length > 3 && uptPassword.newValue === uptPassword.confValue)}
            onClick={(e) => { 
              e.preventDefault();
              update();
            }}
          ><Trans>common.done</Trans></Button>
        </Grid>
      </Grid>
    </form>
  }

  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>profile.title</Trans>
          </div>
          <div>
            <Grid
              container
            >
              <Grid 
                xs={12}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.code</Trans>{context.code}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_first</Trans>{context.name_first}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_last</Trans>{context.name_last}
              </Grid>
            </Grid>
            <Divider>
              <Chip label={<Trans>profile.password</Trans>} size="small" />
            </Divider>
            {content}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {errorMessage}
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};