import * as React from 'react';
import { Add } from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { CODES } from '@src/common/codes';
import { REGEX } from '@src/common/REGEX';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { THING_TYPES } from '@src/common/thingTypes';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { ContextStoreModel, contextStore } from '@presentation/store/contextStore';
import { CreateThingUsecaseModel } from '@usecase/createThing/createThing.usecase.model';

export const CreateThing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const chest_id = searchParams.get('chest_id');
  const context:ContextStoreModel = contextStore();
  const chest_label = searchParams.get('chest_label');
  const [formEntities, setFormEntities] = React.useState({
    label: {
      value: '',
      valid: false
    },
    description: {
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
    }
  });
  const [thingTotp, setThingTotp] = React.useState('');
  const [thingType, setThingType] = React.useState('');
  const [thingCode, setThingCode] = React.useState('');
  const [thingNote, setThingNote] = React.useState('');
  const [thingLogin, setThingLogin] = React.useState('');
  const [thingLabel, setThingLabel] = React.useState('');
  const [thingCbCode, setThingCbCode] = React.useState('');
  const [thingNumber, setThingNumber] = React.useState('');
  const [thingCrypto, setThingCrypto] = React.useState('');
  const [thingCbName, setThingCbName] = React.useState('');
  const [thingAddress, setThingAddress] = React.useState('');
  const [thingPassword, setThingPassword] = React.useState('');
  const [thingDescription, setThingDescription] = React.useState('');
  const [thingExepirationDate, setThingExepirationDate] = React.useState('');
  const secret = context.chests_secret?.find((elt) => elt.id === searchParams.get('chest_id'))?.secret ?? '';
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const handleCreateThing = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));

    let dto:any = {
      label: thingLabel,
      chest_id: chest_id,
      chest_secret: secret,
      description: thingDescription,
      type: thingType
    };

    if(thingType === THING_TYPES.CB) {
      dto.cb = {
        code: thingCbCode,
        label: thingLabel,
        number: thingNumber,
        expiration_date: thingExepirationDate,
        crypto: thingCrypto,
      }
    } else if(thingType === THING_TYPES.NOTE) {
      dto.note = {
        note: thingNote
      }
    } else if(thingType === THING_TYPES.CODE) {
      dto.code = {
        code: thingCode
      }
    } else if(thingType === THING_TYPES.CREDENTIAL) {
      dto.credential = {
        id: thingLogin,
        password: thingPassword,
        address: thingAddress,
      }
    } else if(thingType === THING_TYPES.TOTP) {
      dto.totp = {
        secret: thingTotp
      }
    }

    inversify.createThingUsecase.execute(dto)
      .then((response:CreateThingUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('thing.created'));
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

  if(qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else {
    content = <form
      onSubmit={handleCreateThing}
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
            fullWidth
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

        {/* Field type */}
        <Grid 
          xs={12}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel><Trans>thing.type</Trans></InputLabel>
            <Select
              value={thingType}
              variant="standard"
              size="small"
              onChange={(e) => { 
                e.preventDefault();
                setThingType(e.target.value);
              }}
            >
              <MenuItem value=''><Trans>thing.typeNone</Trans></MenuItem>
              <MenuItem value={THING_TYPES.CB}><Trans>thingType.{THING_TYPES.CB}</Trans></MenuItem>
              <MenuItem value={THING_TYPES.CODE}><Trans>thingType.{THING_TYPES.CODE}</Trans></MenuItem>
              <MenuItem value={THING_TYPES.NOTE}><Trans>thingType.{THING_TYPES.NOTE}</Trans></MenuItem>
              <MenuItem value={THING_TYPES.CREDENTIAL}><Trans>thingType.{THING_TYPES.CREDENTIAL}</Trans></MenuItem>
              <MenuItem value={THING_TYPES.TOTP}><Trans>thingType.{THING_TYPES.TOTP}</Trans></MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Field code */}
        <Grid 
          xs={12}
          item
          display={thingType !== THING_TYPES.CODE ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <Input
            fullWidth
            label={<Trans>thing.code</Trans>}
            tooltip={<Trans>REGEX.THING_CODE</Trans>}
            regex={REGEX.THING_DESCRIPTION}
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

        {/* Field note */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.NOTE ? "none" : "flex"}
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

        {/* Field totp */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.TOTP ? "none" : "flex"}
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

        {/* Field credential.login */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
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
          display={thingType !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
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
          display={thingType !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
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
          display={thingType !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.number</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thingNumber}
            onChange={(e) => { 
              e.preventDefault();
              setThingNumber(e.target.value);
            }}
          />
        </Grid>

        {/* Field cb.code */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.code</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thingCbCode}
            onChange={(e) => { 
              e.preventDefault();
              setThingCbCode(e.target.value);
            }}
          />
        </Grid>

        {/* Field cb.crypto */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.crypto</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thingCrypto}
            onChange={(e) => { 
              e.preventDefault();
              setThingCrypto(e.target.value);
            }}
          />
        </Grid>

        {/* Field cb.name */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={thingType !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.cbName</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thingCbName}
            onChange={(e) => { 
              e.preventDefault();
              setThingCbName(e.target.value);
            }}
          />
        </Grid>

        {/* Field cb.expiration_date */}
        <Grid 
          xs={6}
          item
          display={thingType !== THING_TYPES.CB ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.expirationDate</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thingExepirationDate}
            onChange={(e) => { 
              e.preventDefault();
              setThingExepirationDate(e.target.value);
            }}
          />
        </Grid>

        {/* Button submit */}
        <Grid 
          xs={12}
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
            disabled={
              !(thingLabel.length > 2
                && thingDescription.length > 2
                && thingType !== ''
              )
            }
          ><Trans>thing.submit</Trans></Button>
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
            Ajouter à {searchParams.get('chest_label')}
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