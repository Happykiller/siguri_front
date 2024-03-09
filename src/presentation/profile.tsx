import * as React from 'react';
import { Trans } from 'react-i18next';
import { Divider } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
            <Grid
              container
            >
              <Grid
                item
                width='100%'
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {/* Field old password */}
                <TextField
                  sx={{ marginRight:1}}
                  label={<Trans>profile.oldpassword</Trans>}
                  variant="standard"
                  size="small"
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
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};