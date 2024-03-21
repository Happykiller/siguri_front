import * as React from 'react';
import { Button, Grid } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { GetChestUsecaseModel } from '@usecase/getChest/getChest.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/store/contextStore';
import UpdateChestUsecaseModel from '@usecase/updateChest/updateChest.usecase.model';

export const EditChest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const context:ContextStoreModel = contextStore();
  const [formEntities, setFormEntities] = React.useState({
    id: {
      value: '',
      valid: false
    },
    label: {
      value: '',
      valid: false
    },
    description: {
      value: '',
      valid: false
    }
  });
  const secret = context.chests_secret?.find((elt) => elt.id === searchParams.get('chest_id'))?.secret ?? '';
  const [qry, setQry] = React.useState({
    loading: true,
    data: null,
    error: null
  });

  const handleEditChest = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.updateChestUsecase.execute({
      id: formEntities.id.value,
      label: formEntities.label.value,
      description: formEntities.description.value
    }).then((response:UpdateChestUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        flash.open(t('edit_chest.editd'));
        navigate({
          pathname: '/bank'
        });
      } else {
        inversify.loggerService.debug(response.error);
        flash.open(t(`edit_chest.${response.message}`));
        setQry(qry => ({
          ...qry,
          error: true
        }));
      }
    })
    .catch((error:any) => {
      inversify.loggerService.debug(error.error);
      flash.open(t(`edit_chest.${error.message}`));
      setQry(qry => ({
        ...qry,
        error: true
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
    errorMessage = <Trans>thing.{qry.error}</Trans>;
  }

  if (qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else if (!formEntities.id.valid && !qry.error) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getChestUsecase.execute({
      id: formEntities.id.value,
      secret: secret
    }).then((response:GetChestUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setFormEntities({
            id: {
              value: response.data.id,
              valid: true
            },
            label: {
              value: response.data.label,
              valid: true
            },
            description: {
              value: response.data.description,
              valid: true
            }
          });
        } else {
          inversify.loggerService.debug(response.error);
          flash.open(t(`edit_thing.${response.message}`));
          setQry(qry => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error:any) => {
        inversify.loggerService.debug(error.error);
        flash.open(t(`edit_thing.${error.message}`));
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
  } else {
    content = <form
      onSubmit={handleEditChest}
    >
      <Grid 
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {/* Field label */}
        <Grid 
          xs={12}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            label={<Trans>thing.label</Trans>}
            tooltip={<Trans>REGEX.THING_LABEL</Trans>}
            regex={REGEX.THING_LABEL}
            entity={formEntities.label}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                label: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field description */}
        <Grid 
          xs={12}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            label={<Trans>thing.description</Trans>}
            tooltip={<Trans>REGEX.THING_DESCRIPTION</Trans>}
            regex={REGEX.THING_DESCRIPTION}
            entity={formEntities.description}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                description: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
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
            <Trans>edit_chest.title</Trans>
          </div>
          <div>
            {content}
          </div>
          <div>
            {errorMessage}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}