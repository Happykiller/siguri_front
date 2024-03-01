import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { CODES } from '@src/common/codes';
import { Send } from '@mui/icons-material';
import inversify from '@src/common/inversify';
import { Footer } from '@presentation/footer';
import { FlashStore, flashStore} from '@presentation/flash';
import { GeneratePasswordUsecaseModel } from '@usecase/generatePassword/model/generatePassword.usecase.model';

export const Password = () => {
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const [qry, setQry] = React.useState({
    loading: null,
    data: null,
    error: null
  });
  const [specials, setSpecials] = React.useState(true);
  const [length, setLength] = React.useState(16);

  const handleClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.generatePasswordUsecase.execute({
      length,
      specials
    }).then((response:GeneratePasswordUsecaseModel) => {
      if(response.message === CODES.SUCCESS) {
        setQry(qry => ({
          ...qry,
          data: response.data.password
        }));
        navigator.clipboard.writeText(response.data.password);
        flash.open(t('password.sucess'));
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

  let message = <div></div>;
  if(qry.error) {
    message = <div><Trans>password.{qry.error}</Trans></div>
  } else if(qry.data) {
    message = <h2><Trans>password.generated</Trans>{qry.data}</h2>
  }

  let form = <div></div>;
  if(qry.loading) {
    form = <div><Trans>common.loading</Trans></div>;
  } else {
    form = <form
      onSubmit={handleClick}
    >
      <Grid 
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {/* Field length */}
        <Grid 
          xs={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1 }}
            label={<Trans>password.length</Trans>}
            variant="standard"
            size="small"
            type='number'
            value={length}
            onChange={(e) => { 
              e.preventDefault();
              setLength(parseInt(e.target.value));
            }}
          />
        </Grid>

        {/* Field specials */}
        <Grid 
          xs={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FormControlLabel control={
              <Checkbox 
                checked={specials}
                onChange={e => {
                  setSpecials(e.target.checked);
                }} 
              />
            } 
            label={<Trans>password.specials</Trans>}
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
            startIcon={<Send />}
          ><Trans>password.generate</Trans></Button>
        </Grid>
      </Grid>
    </form>;
  }

  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>password.title</Trans>
          </div>
          <div>
            <Grid 
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Form */}
              <Grid 
                xs={12}
                item
                textAlign='center'
              >
                {form}
              </Grid>

              {/* Message */}
              <Grid 
                xs={12}
                item
                textAlign='center'
              >
                {message}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};