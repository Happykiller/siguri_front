import * as React from 'react';
import { Add } from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Grid, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

import Bar from '@presentation/bar';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Footer } from '@presentation/footer';
import { THING_TYPES } from '@src/common/thingTypes';
import { FlashStore, flashStore} from '@presentation/flash';
import ThingUsecaseModel from '@usecase/model/thing.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/contextStore';
import GetThingUsecaseModel from '@usecase/getThing/getThing.usecase.model';
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
  const [thing, setThing] = React.useState<ThingUsecaseModel>(null);
  const secret = context.chests_secret?.find((elt) => elt.id === searchParams.get('chest_id'))?.secret ?? '';
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const handleUpdateThing = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));

    inversify.updateThingUsecase.execute({
      ... thing,
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
      thing_id: thing.id,
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
  } else if (!thing && !qry.error) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getThingUsecase.execute({
      thing_id,
      chest_secret: secret
    })
      .then((response:GetThingUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setThing(response.data);
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
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.label</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.label}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                label: e.target.value
              });
            }}
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
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.description</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.description}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                description: e.target.value
              });
            }}
          />
        </Grid>

        {/* Field code */}
        <Grid 
          xs={12}
          item
          display={thing.type !== THING_TYPES.CODE ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.code</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.code?.code}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                code: {
                  code: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field note */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.NOTE ? "none" : "flex"}
        >
          <TextField
            multiline
            rows={4}
            sx={{ 
              marginRight:1,
              width: '300px'
            }}
            label={<Trans>thing.note</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.note?.note}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                note: {
                  note: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field credential.login */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.login</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.credential?.id}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                credential: {
                  ...thing.credential,
                  id: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field credential.password */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.password</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.credential?.password}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                credential: {
                  ...thing.credential,
                  password: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field credential.address */}
        <Grid 
          xs={12}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CREDENTIAL ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.address</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.credential?.address}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                credential: {
                  ...thing.credential,
                  address: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field cb.number */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.number</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.cb?.number}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                cb: {
                  ...thing.cb,
                  number: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field cb.code */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.code</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.cb?.code}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                cb: {
                  ...thing.cb,
                  code: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field cb.crypto */}
        <Grid 
          xs={4}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.crypto</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.cb?.crypto}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                cb: {
                  ...thing.cb,
                  crypto: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field cb.name */}
        <Grid 
          xs={6}
          item
          justifyContent="center"
          alignItems="center"
          display={thing.type !== THING_TYPES.CB ? "none" : "flex"}
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.cbName</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.cb?.label}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                cb: {
                  ...thing.cb,
                  label: e.target.value
                }
              });
            }}
          />
        </Grid>

        {/* Field cb.expiration_date */}
        <Grid 
          xs={6}
          item
          display={thing.type !== THING_TYPES.CB ? "none" : "flex"}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>thing.expirationDate</Trans>}
            variant="standard"
            size="small"
            type='text'
            value={thing.cb?.expiration_date}
            onChange={(e) => { 
              e.preventDefault();
              setThing({
                ... thing,
                cb: {
                  ...thing.cb,
                  expiration_date: e.target.value
                }
              });
            }}
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
            disabled={!(thing.label.length > 2 && thing.description.length > 2)}
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