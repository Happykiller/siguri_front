import * as React from 'react';
import { Key } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import NotesIcon from '@mui/icons-material/Notes';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { Trans, useTranslation } from 'react-i18next';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PasswordIcon from '@mui/icons-material/Password';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@presentation/footer';
import inversify from '@src/common/inversify';
import { THING_TYPES } from '@src/common/thingTypes';
import { FlashStore, flashStore} from '@presentation/flash';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/contextStore';
import { GetThingsUsecaseModel } from '@usecase/getThings/getThings.usecase.model';

export const Chest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const context:ContextStoreModel = contextStore();
  const [openRowChild, setOpenRowChild] = React.useState(null);
  const [things, setThings] = React.useState<ThingUsecaseModel[]>(null);
  const se = context.chests_secret?.find((elt) => elt.id === searchParams.get('chest_id'))?.secret ?? '';
  const [secretForm, setSecretForm] = React.useState(se);
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const handleSetSecret = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if(!context.chests_secret) {
      context.chests_secret = [{
        id: searchParams.get('chest_id'),
        secret: secretForm
      }];
    } else {
      context.chests_secret.push({
        id: searchParams.get('chest_id'),
        secret: secretForm
      });
    }
    contextStore.setState({ 
      chests_secret: context.chests_secret
    });
  }

  const keyOff = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const index = context.chests_secret.findIndex((elt) => elt.id === searchParams.get('chest_id'));
    if (index > -1) {
      context.chests_secret.splice(index, 1);
    }
    contextStore.setState({ 
      chests_secret: context.chests_secret
    });
    navigate({
      pathname: '/bank'
    });
  }

  const newThing = async (event: React.SyntheticEvent) => {
    navigate({
      pathname: '/thing',
      search: createSearchParams({
        chest_id: searchParams.get('chest_id'),
        chest_label: searchParams.get('chest_label')
      }).toString()
    });
  }

  const copy = (dto: { value: string, type: string}) => {
    navigator.clipboard.writeText(dto.value);
    flash.open(t(`chest.copy.${dto.type}`));
  }

  const RowChild = (props: { thing: ThingUsecaseModel }) => {
    const { thing } = props;

    if (thing.type === 'CREDENTIAL') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={6}
            md={4}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.credential.id}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.id,
                  type: 'credential.id'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={6}
            md={4}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.credential.password}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.password,
                  type: 'credential.password'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={12}
            md={4}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.credential.address}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.address,
                  type: 'credential.address'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                window.open(thing.credential.address, '_blank').focus();
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          </Grid>

        </Grid>
      )
    } else if (thing.type === 'CB') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={6}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.cb.number}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.number,
                  type: 'cb.number'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.cb.code}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.code,
                  type: 'cb.code'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.cb.crypto}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.crypto,
                  type: 'cb.crypto'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={8}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.cb.label}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.label,
                  type: 'cb.label'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={4}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {thing.cb.expiration_date}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.expiration_date,
                  type: 'cb.expiration_date'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

        </Grid>
      )
    } else if (thing.type === 'CODE') {
      return (
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
            {thing.code.code}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.code.code,
                  type: 'code.code'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    } else if (thing.type === 'NOTE') {
      return (
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
            {thing.note.note}
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.note.note,
                  type: 'note.note'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <p>Type inconnu</p>
      )
    }
  }

  const Row = (props: { thing: ThingUsecaseModel }) => {
    const { thing } = props;

    return (
      <Grid
        container
        sx={{
          backgroundColor: '#1A2027'
        }}
      >
        <Grid 
          xs={3}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={thing.label}
        >
          {(thing.type === THING_TYPES.CB)?<Tooltip title='Carte de payement' ><CreditCardIcon/></Tooltip>:''}
          {(thing.type === THING_TYPES.CODE)?<KeyboardIcon />:''}
          {(thing.type === THING_TYPES.NOTE)?<NotesIcon />:''}
          {(thing.type === THING_TYPES.CREDENTIAL)?<PasswordIcon />:''}
          &nbsp;
          <Typography noWrap>{thing.label}</Typography>
        </Grid>
        <Grid 
          xs={3}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={thing.author.code}
        >
          <Typography noWrap>{thing.author.code}</Typography>
        </Grid>
        <Grid 
          xs={3}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={thing.description}
        >
          <Typography noWrap>{thing.description}</Typography>
        </Grid>
        <Grid 
          xs={3}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <IconButton
            size="small"
            onClick={() => {
              if (!openRowChild) {
                setOpenRowChild({
                  thing_id: thing.id 
                });
              } else {
                setOpenRowChild(null);
              }
            }}
          >
            {openRowChild ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Grid>
        <Grid 
          xs={12}
          item
          display={(openRowChild?.thing_id !== thing.id) ? "none" : "flex"}
        >
          <RowChild thing={thing} />
        </Grid>
      </Grid>
    )
  }

  let content = <div></div>;
  let errorMessage = <div></div>;

  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else if (!se) {
    content = <form
    onSubmit={handleSetSecret}
  ><Grid 
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
        label={<Trans>chest.secret</Trans>}
        variant="standard"
        size="small"
        type='text'
        value={secretForm}
        onChange={(e) => { 
          e.preventDefault();
          setSecretForm(e.target.value);
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
        startIcon={<Key />}
      ><Trans>chest.submit</Trans></Button>
    </Grid>

  </Grid></form>;
  } else if(qry.error) {
    errorMessage = <Grid 
      container
      rowSpacing={1}
    >
      <Grid 
        container
        direction="row"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>chest.{qry.error}</Trans>
      </Grid>
      <Grid 
        container
        direction="row" 
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          sx={{
            m: 1
          }}
          type="submit"
          variant="contained"
          size="small"
          startIcon={<KeyOffIcon />}
          onClick={keyOff}
        ><Trans>chest.keyoff</Trans></Button>
      </Grid>
    </Grid>
  } else if (!things) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getThingsUsecase.execute({
      chest_id: searchParams.get('chest_id'),
      chest_secret: se
    })
      .then((response:GetThingsUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setThings(response.data);
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
    content = <Grid 
      container
    >
      <Grid 
        container
        direction="row" 
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          sx={{
            m: 1
          }}
          type="submit"
          variant="contained"
          size="small"
          startIcon={<KeyOffIcon />}
          onClick={keyOff}
        ><Trans>chest.keyoff</Trans></Button>
        <Button 
          sx={{
            m: 1
          }}
          type="submit"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={newThing}
        ><Trans>chest.newThing</Trans></Button>
      </Grid>

      {/* Table */}
      <Grid
        container
      >
        <Grid
          container
          sx={{
            color: "#000000",
            fontWeight: "bold",
            backgroundColor: "#BB86FC",
            borderRadius: "5px 5px 0px 0px"
          }}
        >
          <Grid 
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Label
          </Grid>
          <Grid 
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Auteur
          </Grid>
          <Grid 
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Description
          </Grid>
          <Grid>
          </Grid>
        </Grid>

        {things?.map((thing) => (
          <Row key={thing.id} thing={thing} />
        ))}

      </Grid>
    </Grid>;
  }

  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            {searchParams.get('chest_label')}
          </div>
          {content}
          <div>
            {errorMessage}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}