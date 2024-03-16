import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import { Trans, useTranslation } from 'react-i18next';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { createSearchParams, useNavigate } from "react-router-dom";
import { Button, Divider, Grid, IconButton, InputBase, Paper, TextField, Tooltip, Typography } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@src/presentation/molecule/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@src/presentation/molecule/footer';
import inversify from '@src/common/inversify';
import { FlashStore, flashStore} from '@src/presentation/molecule/flash';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/contextStore';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';
import { JoinChestUsecaseModel } from '@usecase/joinChest/joinChest.usecase.model';
import { CreateChestUsecaseModel } from '@usecase/createChest/createChest.usecase.model';

export const Bank = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [code, setCode] = React.useState('');
  const context:ContextStoreModel = contextStore();
  const [chestKey, setChestKey] = React.useState('');
  const [chestDesc, setChestDesc] = React.useState('');
  const [currentMsg, setCurrentMsg] = React.useState('');
  const [chestLabel, setChestLabel] = React.useState('');
  const [currentAction, setCurrentAction] = React.useState('default');
  const [chests, setChest] = React.useState<ChestUsecaseModel[]>(null);
  const [qry, setQry] = React.useState({
    loading: true,
    data: null,
    error: null
  });

  if(chests === null) {
    setChest([]);
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getChestsUsecase.execute()
      .then((response:GetChestsUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setChest(response.data);
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

  const handleOpenFormChest = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setCurrentAction('createChest');
  }

  const join = () => {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.joinChestUsecase.execute({
      chest_id: code
    }).then((response:JoinChestUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        flash.open(t('bank.joined'));
        setChest(null);
        setCode('');
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

  const joinChest = (dto:{
    chest_id: string,
    label: string
  }) => {
    navigate({
      pathname: '/chest',
      search: createSearchParams({
        chest_id: dto.chest_id,
        chest_label: dto.label
      }).toString()
    });
  }

  const share = (dto:{
    chest_id: string,
    label: string
  }) => {
    navigator.clipboard.writeText(dto.chest_id);
    flash.open(t(`bank.copy`)+dto.label);
  }

  const handleCreateChest = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.createChestUsecase.execute({
      label: chestLabel,
      secret: chestKey,
      description: chestDesc
    }).then((response:CreateChestUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        flash.open(t('bank.formChest.created'));
        setCurrentAction('default');
        setChest(null);
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

  const defaultContent = <div><Grid 
    container
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{
      p: 1,
      m: 1,
    }}
  >
    <Button 
      sx={{
        m: 1,
      }}
      type="submit"
      variant="contained"
      size="small"
      startIcon={<AddIcon />}
      onClick={handleOpenFormChest}
    ><Trans>bank.createChest</Trans></Button>
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t('bank.join')}
        inputProps={{ 'aria-label': t('bank.join') }}
        value={code}
        onChange={(e) => { 
          e.preventDefault();
          setCode(e.target.value);
        }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton 
        color="primary" 
        sx={{ p: '10px' }} 
        title={t('bank.joinTitle')}
        disabled={(code.length !== 24)}
        onClick={(e) => {
          e.preventDefault();
          join()
        }}
      >
        <AddToPhotosIcon />
      </IconButton>
    </Paper>
  </Grid>

  {/* Table */}
  <Grid
    container
    sx={{
      minWidth: "350px"
    }}
  >
    <Grid
      container
      sx={{
        color: "#000000",
        fontWeight: "bold",
        backgroundColor: "#BB86FC",
        borderRadius: "5px 5px 0px 0px",
        fontSize: "0.875rem"
      }}
    >
      <Grid 
        xs={4}
        md={4}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>bank.label</Trans>
      </Grid>
      <Grid 
        md={1}
        item
        display={{ xs: "none", md: "flex" }}
        justifyContent="center"
        alignItems="center"
      >
        <Trans>bank.author</Trans>
      </Grid>
      <Grid
        item
        xs={6}
        md={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>bank.description</Trans>
      </Grid>
      <Grid
        item
        xs={2}
        md={2}
      >
      </Grid>
    </Grid>
    
    {chests?.map((chest) => {
      return (
      <Grid
        key={chest.id}
        container
        sx={{
          backgroundColor: '#1A2027',
          marginBottom:'1px',
        }}
      >
        <Grid 
          xs={4}
          md={4}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={chest.label}
        >
          <Typography noWrap>{chest.label}</Typography>
        </Grid>
        <Grid 
          md={1}
          item
          display={{ xs: "none", md: "flex" }}
          justifyContent="center"
          alignItems="center"
          title={chest.author.code}
        >
          <Typography noWrap>{chest.author.code}</Typography>
        </Grid>
        <Grid 
          item
          xs={6}
          md={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={chest.description}
        >
          <Typography noWrap>{chest.description}</Typography>
        </Grid>
        <Grid
          xs={2}
          md={2}
          sx={{
            paddingRight: '15px'
          }}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Other user ? */}
          {
            (chest.members.filter((member) => member.user_id !== context.id).length > 0)?
              <Tooltip title={
                <>
                  {chest.members.filter((member) => member.user_id !== context.id).map((member) => {
                    return <li key={member.user_id}>{member.user.code}</li>
                  })}
                </>
              }>
                <IconButton>
                  <GroupIcon />
                </IconButton>
              </Tooltip>
            :''
          }

          {/* Share  */}
          <IconButton 
            title="Partager le coffre"
            onClick={(e) => {
            e.preventDefault();
            share({
              chest_id: chest.id,
              label: chest.label
            })
          }}>
            <ShareIcon />
          </IconButton>

          {/* Enter  */}
          <IconButton 
            title="Entrer dans le coffre"
            onClick={(e) => {
            e.preventDefault();
            joinChest({
              chest_id: chest.id,
              label: chest.label
            })
          }}>
            <LoginIcon />
          </IconButton>
        </Grid>
      </Grid>
    )})}

  </Grid>
</div>
;

  const createChestContent = <form
    onSubmit={handleCreateChest}
  ><Grid 
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
      <TextField
        sx={{ marginRight:1 }}
        label={<Trans>bank.formChest.label</Trans>}
        variant="standard"
        size="small"
        type='text'
        value={chestLabel}
        onChange={(e) => { 
          e.preventDefault();
          setChestLabel(e.target.value);
        }}
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
      <TextField
        sx={{ marginRight:1 }}
        label={<Trans>bank.formChest.key</Trans>}
        variant="standard"
        size="small"
        type='text'
        value={chestKey}
        onChange={(e) => { 
          e.preventDefault();
          setChestKey(e.target.value);
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
        fullWidth
        label={<Trans>bank.formChest.description</Trans>}
        variant="standard"
        size="small"
        value={chestDesc}
        onChange={(e) => { 
          e.preventDefault();
          setChestDesc(e.target.value);
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
        startIcon={<AddIcon />}
      ><Trans>bank.formChest.create</Trans></Button>
    </Grid>

    {/* Button submit */}
    <Grid 
      xs={12}
      item
      textAlign='center'
    >
      {currentMsg}
    </Grid>

  </Grid></form>;

  let content = <div></div>;
  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else if (currentAction === 'default') {
    content = defaultContent;
  } else if (currentAction === 'createChest') { 
    content = createChestContent;
  }

  let errorMessage = <div></div>;
  if(qry.error) {
    errorMessage = <div><Trans>login.{qry.error}</Trans></div>
  }
  
  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>bank.title</Trans>
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
};