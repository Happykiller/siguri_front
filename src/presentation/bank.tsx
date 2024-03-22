import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import { Trans, useTranslation } from 'react-i18next';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { createSearchParams, useNavigate } from "react-router-dom";
import { Button, Divider, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';

import '@presentation/common.scss';
import { REGEX } from '@src/common/REGEX';
import { CODES } from '@src/common/codes';
import Bar from '@presentation/molecule/bar';
import inversify from '@src/common/inversify';
import { Input } from '@presentation/molecule/input';
import { Footer } from '@presentation/molecule/footer';
import { FlashStore, flashStore} from '@presentation/molecule/flash';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { ContextStoreModel, contextStore } from '@presentation/store/contextStore';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';
import { JoinChestUsecaseModel } from '@usecase/joinChest/joinChest.usecase.model';

export const Bank = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
  const [code, setCode] = React.useState({
    value: '',
    valid: false
  });
  const context:ContextStoreModel = contextStore();
  const [chests, setChest] = React.useState<ChestUsecaseModel[]>(null);
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const join = () => {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.joinChestUsecase.execute({
      chest_id: code.value
    }).then((response:JoinChestUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        flash.open(t('bank.joined'));
        setChest(null);
        setCode({
          value: '',
          valid: false
        });
      } else {
        flash.open(t(`bank.${response.message}`));
        setQry(qry => ({
          ...qry,
          error: true
        }));
      }
    })
    .catch((error:any) => {
      flash.open(t(`bank.${error.message}`));
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

  const editChest = (dto:{
    chest_id: string,
    label: string
  }) => {
    navigate({
      pathname: '/edit_chest',
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
      onClick={(e) => {
        e.preventDefault();
        navigate({
          pathname: '/create_chest'
        });
      }}
    ><Trans>bank.createChest</Trans></Button>
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <Input
        label={<Trans>bank.join</Trans>}
        tooltip={<Trans>REGEX.CHEST_CODE</Trans>}
        regex={REGEX.CHEST_CODE}
        entity={code}
        onChange={(entity:any) => { 
          setCode({
            value: entity.value,
            valid: entity.valid
          });
        }}
        require
        virgin
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton 
        color="primary" 
        sx={{ p: '10px' }} 
        title={t('bank.joinTitle')}
        disabled={!code.valid}
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
  >
    <Grid
      container
      sx={{
        color: "#000000",
        fontWeight: "bold",
        backgroundColor: "#EA80FC",
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
        xs={5}
        md={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>bank.description</Trans>
      </Grid>
      <Grid
        item
        xs={3}
        md={3}
        sx={{
          width: '130px'
        }}
      >
      </Grid>
    </Grid>
    
    {chests?.map((chest) => {
      return (
      <Grid
        key={chest.id}
        container
        sx={{
          backgroundColor: '#3C4042',
          marginBottom:'1px',
          "&:hover": {
            backgroundColor: "#606368"
          }
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
          xs={5}
          md={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={chest.description}
        >
          <Typography noWrap>{chest.description}</Typography>
        </Grid>
        <Grid
          xs={3}
          md={3}
          sx={{
            width: '130px'
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
            title={t('bank.share')}
            onClick={(e) => {
            e.preventDefault();
            share({
              chest_id: chest.id,
              label: chest.label
            })
          }}>
            <ShareIcon />
          </IconButton>

          {/* Edit  */}
          <IconButton 
            title={t('bank.edit')}
            onClick={(e) => {
            e.preventDefault();
            editChest({
              chest_id: chest.id,
              label: chest.label
            })
          }}>
            <EditIcon />
          </IconButton>

          {/* Enter  */}
          <IconButton 
            title={t('bank.enter')}
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

  </Grid></div>;

  let content = <div></div>;
  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else if(qry.error) {
    content = <div><Trans>bank.{qry.error}</Trans></div>;
  } else if(chests === null) {
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
  } else {
    content = defaultContent;
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
        </div>
      </div>
      <Footer />
    </div>
  )
};