import * as React from 'react';
import { Trans } from 'react-i18next';
import { Button, Divider } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Chip, Grid, InputAdornment, TextField } from '@mui/material';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { Footer } from '@presentation/footer';
import { ContextStoreModel, contextStore } from '@presentation/contextStore';

export const Profile = () => {
  const context:ContextStoreModel = contextStore();
  const [uptPassword, setUptPassword] = React.useState({
    oldVisible: false,
    oldValue: '',
    newVisible: false,
    newValue: '',
    confVisible: false,
    confValue: ''
  });
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const update = () => {
  }

  let content = <div></div>;
  let errorMessage = <div></div>;

  if (qry.error) {
    errorMessage = <div><Trans>profile.{qry.error}</Trans></div>
  }

  if (qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else {
    content = <Grid
      container
    >
      <Grid
        item
        xs={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Field old password */}
        <TextField
          sx={{ marginRight: 1 }}
          label={<Trans>profile.oldPassword</Trans>}
          variant="standard"
          size="small"
          autoComplete='off'
          type={(uptPassword.oldVisible)?'text':'password'}
          onChange={(e) => { 
            e.preventDefault();
            setUptPassword({
              ... uptPassword,
              oldValue: e.target.value
            });
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment 
                position="end"
                onClick={(e) => { 
                  e.preventDefault();
                  setUptPassword({
                    ... uptPassword,
                    oldVisible: !uptPassword.oldVisible
                  });
                }}
              >
                {(uptPassword.oldVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid
        item
        xs={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Field new password */}
        <TextField
          sx={{ marginRight: 1 }}
          label={<Trans>profile.newPassword</Trans>}
          variant="standard"
          size="small"
          autoComplete='off'
          type={(uptPassword.newVisible)?'text':'password'}
          onChange={(e) => { 
            e.preventDefault();
            setUptPassword({
              ... uptPassword,
              newValue: e.target.value
            });
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment 
                position="end"
                onClick={(e) => { 
                  e.preventDefault();
                  setUptPassword({
                    ... uptPassword,
                    newVisible: !uptPassword.newVisible
                  });
                }}
              >
                {(uptPassword.newVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid
        item
        xs={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Field confirm password */}
        <TextField
          sx={{ marginRight: 1 }}
          label={<Trans>profile.confPassword</Trans>}
          variant="standard"
          size="small"
          autoComplete='off'
          type={(uptPassword.confVisible)?'text':'password'}
          onChange={(e) => { 
            e.preventDefault();
            setUptPassword({
              ... uptPassword,
              confValue: e.target.value
            });
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment 
                position="end"
                onClick={(e) => { 
                  e.preventDefault();
                  setUptPassword({
                    ... uptPassword,
                    confVisible: !uptPassword.confVisible
                  });
                }}
              >
                {(uptPassword.confVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid
        item
        xs={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Submit button */}
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<SystemUpdateAltIcon />}
          disabled={!(uptPassword.newValue.length > 3 && uptPassword.newValue === uptPassword.confValue)}
          onClick={(e) => { 
            e.preventDefault();
            update();
          }}
        ><Trans>common.done</Trans></Button>
      </Grid>
    </Grid>
  }

  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>profile.title</Trans>
          </div>
          <div>
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
                <Trans>profile.code</Trans>{context.code}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_first</Trans>{context.name_first}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_last</Trans>{context.name_last}
              </Grid>
            </Grid>
            <Divider>
              <Chip label={<Trans>profile.password</Trans>} size="small" />
            </Divider>
            {content}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {errorMessage}
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};