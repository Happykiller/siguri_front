import * as React from 'react';
import { Key } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Button, Grid, TextField } from '@mui/material';

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
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const context:ContextStoreModel = contextStore();
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

  let content = <div></div>;
  let errorMessage = <div></div>;

  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else if (!se) {
    content = <Grid 
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
        onClick={handleSetSecret}
      ><Trans>chest.submit</Trans></Button>
    </Grid>

  </Grid>;
  } else if(qry.error) {
    errorMessage = <div><Trans>chest.{qry.error}</Trans></div>
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
    content = <div>ok</div>;
  }

  return (
    <div>
      <Bar/>
      <div className="container">
        <div className='title'>
          {searchParams.get('label')}
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