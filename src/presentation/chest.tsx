import * as React from 'react';
import { Key } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { Trans, useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { Button, Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@presentation/footer';
import inversify from '@src/common/inversify';
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
    // Copy the text inside the text field
    navigator.clipboard.writeText(dto.value);
    flash.open(t(`chest.copy.${dto.type}`));
  }

  const RowChild = (props: { thing: ThingUsecaseModel }) => {
    const { thing } = props;

    if (thing.type === 'CREDENTIAL') {
      return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ 
                  "& th": {
                    color: "#000000",
                    fontWeight: "bold",
                    backgroundColor: "#BB86FC"
                  }
                }}>
                  <TableCell>Identifiant</TableCell>
                  <TableCell>Mot de passe</TableCell>
                  <TableCell>Addresse</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      )
    } else if (thing.type === 'CB') {
      return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ 
                  "& th": {
                    color: "#000000",
                    fontWeight: "bold",
                    backgroundColor: "#BB86FC"
                  }
                }}>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Crypto</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Date d'expiration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      )
    } else if (thing.type === 'CODE') {
      return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ 
                  "& th": {
                    color: "#000000",
                    fontWeight: "bold",
                    backgroundColor: "#BB86FC"
                  }
                }}>
                  <TableCell>Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      )
    } else if (thing.type === 'NOTE') {
      return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ 
                  "& th": {
                    color: "#000000",
                    fontWeight: "bold",
                    backgroundColor: "#BB86FC"
                  }
                }}>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
      <React.Fragment>
        <TableRow
          key={thing.id}
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 }
          }}
        >
          <TableCell>{thing.label}</TableCell>
          <TableCell>{thing.author.code}</TableCell>
          <TableCell>{thing.type}</TableCell>
          <TableCell>{thing.description}</TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
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
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={(openRowChild?.thing_id === thing.id)} timeout="auto" unmountOnExit>
              <RowChild thing={thing} />
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
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
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid 
        container
        direction="row" 
        justifyContent="center"
        alignItems="center"
      >
        <Trans>chest.{qry.error}</Trans>
      </Grid>
      <Grid 
        container
        direction="row" 
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
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid 
        container
        direction="row" 
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
      <Grid
        container
        direction="row" 
        justifyContent="center"
        alignItems="center"
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ 
              "& th": {
                color: "#000000",
                fontWeight: "bold",
                backgroundColor: "#BB86FC"
              }
            }}>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>Auteur</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {things?.map((thing) => (
                <Row key={thing.id} thing={thing} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>;
  }

  return (
    <div>
      <Bar/>
      <div className="container">
        <div className='title'>
          {searchParams.get('chest_label')}
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
}