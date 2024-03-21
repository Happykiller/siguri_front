import * as React from 'react';
import { Add } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

import { CODES } from '@src/common/codes';
import { REGEX } from '@src/common/REGEX';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { THING_TYPES } from '@src/common/thingTypes';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import GetThingUsecaseModel from '@usecase/getThing/getThing.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/store/contextStore';
import UpdateThingUsecaseModel from '@usecase/updateThing/updateThing.usecase.model';
import DeleteThingUsecaseModel from '@usecase/deleteThing/deleteThing.usecase.model';

export const EditThing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const chest_id = searchParams.get('chest_id');
  const thing_id = searchParams.get('thing_id');
  const context:ContextStoreModel = contextStore();
  const chest_label = searchParams.get('chest_label');
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
    },
    type: {
      value: '',
      valid: false
    },
    code: {
      value: '',
      valid: false
    },
    note: {
      value: '',
      valid: false
    },
    totp: {
      value: '',
      valid: false
    },
    login: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: false
    },
    address: {
      value: '',
      valid: false
    },
    cb_number: {
      value: '',
      valid: false
    },
    cb_code: {
      value: '',
      valid: false
    },
    cb_crypto: {
      value: '',
      valid: false
    },
    cb_name: {
      value: '',
      valid: false
    },
    cb_expiration_date: {
      value: '',
      valid: false
    }
  });
  const secret = context.chests_secret?.find((elt) => elt.id === searchParams.get('chest_id'))?.secret ?? '';
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const formIsValid = () => {
    if (!formEntities.label.valid || !formEntities.description.valid) {
      return false;
    }

    if ((formEntities.type.value === THING_TYPES.CB) && (
      !formEntities.cb_code.valid 
      || !formEntities.cb_crypto.valid
      || !formEntities.cb_expiration_date.valid
      || !formEntities.cb_name.valid
      || !formEntities.cb_number.valid
    )) {
      return false;
    }

    if ((formEntities.type.value === THING_TYPES.CODE) && (
      !formEntities.code.valid
    )) {
      return false;
    }

    if ((formEntities.type.value === THING_TYPES.CREDENTIAL) && (
      !formEntities.login.valid 
      || !formEntities.password.valid 
      || !formEntities.address.valid
    )) {
      return false;
    }

    if ((formEntities.type.value === THING_TYPES.NOTE) && (
      !formEntities.note.valid
    )) {
      return false;
    }

    if ((formEntities.type.value === THING_TYPES.TOTP) && (
      !formEntities.totp.valid
    )) {
      return false;
    }

    return true;
  }

  const handleUpdateThing = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));

    let dto:any = {
      id: formEntities.id.value,
      label: formEntities.label.value,
      chest_id: chest_id,
      chest_secret: secret,
      description: formEntities.description.value,
      type: formEntities.type
    };

    if(formEntities.type.value === THING_TYPES.CB) {
      dto.cb = {
        code: formEntities.cb_code.value,
        label: formEntities.cb_name.value,
        number: formEntities.cb_number.value,
        expiration_date: formEntities.cb_expiration_date.value,
        crypto: formEntities.cb_crypto.value,
      }
    } else if(formEntities.type.value === THING_TYPES.NOTE) {
      dto.note = {
        note: formEntities.note.value
      }
    } else if(formEntities.type.value === THING_TYPES.CODE) {
      dto.code = {
        code: formEntities.code.value
      }
    } else if(formEntities.type.value === THING_TYPES.CREDENTIAL) {
      dto.credential = {
        id: formEntities.login.value,
        password: formEntities.password.value,
        address: formEntities.address.value,
      }
    } else if(formEntities.type.value === THING_TYPES.TOTP) {
      dto.totp = {
        secret: formEntities.totp.value
      }
    }

    inversify.updateThingUsecase.execute({
      ... dto,
      chest_secret: secret
    })
      .then((response:UpdateThingUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('editThing.updated'));
          navigate({
            pathname: '/chest',
            search: createSearchParams({
              chest_id: chest_id,
              chest_label: chest_label
            }).toString()
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

  const deleteThing = async () => {
    setQry(qry => ({
      ...qry,
      loading: true
    }));

    inversify.deleteThingUsecase.execute({
      thing_id: formEntities.id.value,
      chest_secret: secret
    })
      .then((response:DeleteThingUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('editThing.deleted'));
          navigate({
            pathname: '/chest',
            search: createSearchParams({
              chest_id: chest_id,
              chest_label: chest_label
            }).toString()
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
    inversify.getThingUsecase.execute({
      thing_id,
      chest_secret: secret
    }).then((response:GetThingUsecaseModel) => {
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
            },
            type: {
              value: response.data.type,
              valid: true
            },
            code: {
              value: (response.data.type === THING_TYPES.CODE)?response.data.code.code:'',
              valid: (response.data.type === THING_TYPES.CODE)?true:false
            },
            note: {
              value: (response.data.type === THING_TYPES.NOTE)?response.data.note.note:'',
              valid: (response.data.type === THING_TYPES.NOTE)?true:false
            },
            totp: {
              value: (response.data.type === THING_TYPES.TOTP)?response.data.totp.secret:'',
              valid: (response.data.type === THING_TYPES.TOTP)?true:false
            },
            login: {
              value: (response.data.type === THING_TYPES.CREDENTIAL)?response.data.credential.id:'',
              valid: (response.data.type === THING_TYPES.CREDENTIAL)?true:false
            },
            password: {
              value: (response.data.type === THING_TYPES.CREDENTIAL)?response.data.credential.password:'',
              valid: (response.data.type === THING_TYPES.CREDENTIAL)?true:false
            },
            address: {
              value: (response.data.type === THING_TYPES.CREDENTIAL)?response.data.credential.address:'',
              valid: (response.data.type === THING_TYPES.CREDENTIAL)?true:false
            },
            cb_number: {
              value: (response.data.type === THING_TYPES.CB)?response.data.cb.number:'',
              valid: (response.data.type === THING_TYPES.CB)?true:false
            },
            cb_code: {
              value: (response.data.type === THING_TYPES.CB)?response.data.cb.code:'',
              valid: (response.data.type === THING_TYPES.CB)?true:false
            },
            cb_crypto: {
              value: (response.data.type === THING_TYPES.CB)?response.data.cb.crypto:'',
              valid: (response.data.type === THING_TYPES.CB)?true:false
            },
            cb_name: {
              value: (response.data.type === THING_TYPES.CB)?response.data.cb.label:'',
              valid: (response.data.type === THING_TYPES.CB)?true:false
            },
            cb_expiration_date: {
              value: (response.data.type === THING_TYPES.CB)?response.data.cb.expiration_date:'',
              valid: (response.data.type === THING_TYPES.CB)?true:false
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
      onSubmit={handleUpdateThing}
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

        {/* Field code */}
        <Grid 
          xs={12}
          item
          display={formEntities.type.value !== THING_TYPES.CODE ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <Input
            fullWidth
            label={<Trans>thing.code</Trans>}
            tooltip={<Trans>REGEX.THING_CODE</Trans>}
            regex={REGEX.THING_CODE}
            entity={formEntities.code}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                code: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field totp */}
        <Grid 
          xs={12}
          item
          display={formEntities.type.value !== THING_TYPES.TOTP ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <Input
            label={<Trans>thing.totp</Trans>}
            tooltip={<Trans>REGEX.THING_TOTP</Trans>}
            regex={REGEX.THING_TOTP}
            entity={formEntities.totp}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                totp: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field note */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.NOTE ? "none" : "flex"}
        >
          <Input
            fullWidth
            multiline
            rows={4}
            label={<Trans>thing.note</Trans>}
            tooltip={<Trans>THING.THING_NOTE</Trans>}
            regex={REGEX.THING_NOTE}
            entity={formEntities.note}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                note: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field credential.login */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.login</Trans>}
            tooltip={<Trans>REGEX.THING_LOGIN</Trans>}
            regex={REGEX.THING_LOGIN}
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
        </Grid>

        {/* Field credential.password */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.password</Trans>}
            tooltip={<Trans>REGEX.THING_PASSWORD</Trans>}
            regex={REGEX.THING_PASSWORD}
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
        </Grid>

        {/* Field credential.address */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <Input
            fullWidth
            label={<Trans>thing.address</Trans>}
            tooltip={<Trans>REGEX.THING_ADDRESS</Trans>}
            regex={REGEX.THING_ADDRESS}
            entity={formEntities.address}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                address: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field cb.number */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CB ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.cb_number</Trans>}
            tooltip={<Trans>REGEX.THING_CB_NUMBER</Trans>}
            regex={REGEX.THING_CB_NUMBER}
            entity={formEntities.cb_number}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                cb_number: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field cb.code */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CB ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.cb_code</Trans>}
            tooltip={<Trans>REGEX.THING_CB_CODE</Trans>}
            regex={REGEX.THING_CB_CODE}
            type="number"
            entity={formEntities.cb_number}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                cb_code: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field cb.crypto */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CB ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.cb_crypto</Trans>}
            tooltip={<Trans>REGEX.THING_CB_CRYPTO</Trans>}
            regex={REGEX.THING_CB_CRYPTO}
            type="number"
            entity={formEntities.cb_crypto}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                cb_crypto: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field cb.name */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={formEntities.type.value !== THING_TYPES.CB ? "none" : "flex"}
        >
          <Input
            label={<Trans>thing.cb_name</Trans>}
            tooltip={<Trans>REGEX.THING_CB_NAME</Trans>}
            regex={REGEX.THING_CB_NAME}
            entity={formEntities.cb_name}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                cb_name: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        {/* Field cb.expiration_date */}
        <Grid 
          xs={6}
          item
          display={formEntities.type.value !== THING_TYPES.CB ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <Input
            label={<Trans>thing.cb_expiration_date</Trans>}
            tooltip={<Trans>REGEX.THING_CB_EXPIRATION_DATE</Trans>}
            regex={REGEX.THING_CB_EXPIRATION_DATE}
            entity={formEntities.cb_expiration_date}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                cb_expiration_date: {
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
          xs={6}
          item
          textAlign='center'
        >
          <Button 
            sx={{
              m: 1,
            }}
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Add />}
            disabled={!formIsValid()}
          ><Trans>editThing.update</Trans></Button>
        </Grid>

        {/* Button delete */}
        <Grid 
          xs={6}
          item
          textAlign='center'
        >
          <Button 
            sx={{
              m: 1,
              backgroundColor: "#CF6679"
            }}
            size="small"
            variant="contained"
            startIcon={<DeleteOutlineIcon />}
            onClick={(e) => {
              e.preventDefault();
              deleteThing()
            }}
          ><Trans>editThing.delete</Trans></Button>
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
            Editer
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