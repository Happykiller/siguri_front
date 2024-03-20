import * as React from 'react';
import { Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { CreateChestUsecaseModel } from '@usecase/createChest/createChest.usecase.model';

export const CreateChest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [formEntities, setFormEntities] = React.useState({
    label: {
      value: '',
      valid: false
    },
    key: {
      value: '',
      valid: false
    },
    description: {
      value: '',
      valid: false
    }
  });
  const [qry, setQry] = React.useState({
    loading: true,
    data: null,
    error: null
  });

  const handleCreateChest = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.createChestUsecase.execute({
      label: formEntities.label.value,
      secret: formEntities.key.value,
      description: formEntities.description.value
    }).then((response:CreateChestUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        flash.open(t('create_chest.created'));
        navigate({
          pathname: '/bank'
        });
      } else {
        inversify.loggerService.debug(response.error);
        flash.open(t(`create_chest.${response.message}`));
        setQry(qry => ({
          ...qry,
          error: true
        }));
      }
    })
    .catch((error:any) => {
      inversify.loggerService.debug(error.error);
      flash.open(t(`create_chest.${error.message}`));
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

  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>create_chest.title</Trans>
          </div>
          <div>
            <form
              onSubmit={handleCreateChest}
            >
              <Grid 
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {/* Field label */}
                <Grid 
                  xs={6}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Input
                    label={<Trans>create_chest.label</Trans>}
                    tooltip={<Trans>REGEX.CHEST_LABEL</Trans>}
                    regex={REGEX.CHEST_LABEL}
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

                {/* Field key */}
                <Grid 
                  xs={6}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Input
                    label={<Trans>create_chest.key</Trans>}
                    tooltip={<Trans>REGEX.CHEST_KEY</Trans>}
                    regex={REGEX.CHEST_KEY}
                    type="password"
                    entity={formEntities.key}
                    onChange={(entity:any) => { 
                      setFormEntities({
                        ... formEntities,
                        key: {
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
                    fullWidth
                    label={<Trans>create_chest.description</Trans>}
                    tooltip={<Trans>REGEX.CHEST_DESCRIPTION</Trans>}
                    regex={REGEX.CHEST_DESCRIPTION}
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

                {/* Button submit */}
                <Grid 
                  xs={12}
                  item
                  textAlign='center'
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    disabled={!formEntities.label.valid || !formEntities.key.valid || !formEntities.description.valid}
                  ><Trans>create_chest.create</Trans></Button>
                </Grid>

              </Grid>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}