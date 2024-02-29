import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import { Trans, useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@presentation/footer';
import inversify from '@src/common/inversify';
import { FlashStore, flashStore} from '@presentation/flash';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';
import { CreateChestUsecaseModel } from '@usecase/createChest/createChest.usecase.model';

export const Bank = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash:FlashStore = flashStore();
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

  const defaultContent = <div><Box 
    sx={{
      display: 'flex',
      alignItems: 'flex-center',
      flexDirection: 'column',
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
  </Box>
  <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Label</TableCell>
        <TableCell>Auteur</TableCell>
        <TableCell>Description</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {chests?.map((chest) => (
        <TableRow
          key={chest.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">{chest.label}</TableCell>
          <TableCell>{chest.author.code}</TableCell>
          <TableCell>{chest.description}</TableCell>
          <TableCell>
            <IconButton onClick={(e) => {
              e.preventDefault();
              joinChest({
                chest_id: chest.id,
                label: chest.label
              })
            }}>
              <LoginIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
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
    <div>
      <Bar/>
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
      <Footer />
    </div>
  )
};