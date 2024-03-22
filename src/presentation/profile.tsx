import * as React from 'react';
import { Chip, Grid } from '@mui/material';
import { Button, Divider } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

import '@presentation/common.scss';
import { CODES } from '@src/common/codes';
import { REGEX } from '@src/common/REGEX';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { ContextStoreModel, contextStore } from '@presentation/store/contextStore';
import { UpdPasswordUsecaseModel } from '@usecase/updPassword/updPassword.usecase.model';

export const Profile = () => {
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const context:ContextStoreModel = contextStore();
  const [formEntities, setFormEntities] = React.useState({
    old: {
      value: '',
      valid: false
    },
    new: {
      value: '',
      valid: false
    },
    conf: {
      value: '',
      valid: false
    }
  });
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
      old_value: formEntities.old.value,
      new_value: formEntities.new.value,
      conf_value: formEntities.conf.value
    })
      .then((response:UpdPasswordUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('profile.passwordUpdated'));
          setFormEntities({
            old: {
              value: '',
              valid: false
            },
            new: {
              value: '',
              valid: false
            },
            conf: {
              value: '',
              valid: false
            }
          });
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

  const formIsValid = () => {
    console.log(!formEntities.new.valid, !formEntities.old.valid, !formEntities.conf.valid, (formEntities.new.value !== formEntities.conf.value))
    if (!formEntities.new.valid || !formEntities.old.valid || !formEntities.conf.valid || (formEntities.new.value !== formEntities.conf.value)) {
      return false;
    }
    return true;
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
          <Input
            label={<Trans>profile.oldPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.old}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                old: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
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
          <Input
            label={<Trans>profile.newPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.new}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                new: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
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
          <Input
            label={<Trans>profile.confPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.conf}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                conf: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
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
            disabled={!formIsValid()}
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