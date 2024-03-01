import * as React from 'react';
import { Trans } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputIcon from '@mui/icons-material/Input';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { Footer } from '@presentation/footer';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="app">
      <Bar/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>home.title</Trans>
          </div>
          <div>
            <Box 
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
                startIcon={<InputIcon />}
                onClick={(e) => {
                  navigate("/bank");
                }}
              ><Trans>home.bank</Trans></Button>
              <Button 
                sx={{
                  m: 1,
                }}
                type="submit"
                variant="contained"
                size="small"
                startIcon={<InputIcon />}
                onClick={(e) => {
                  navigate("/password");
                }}
              ><Trans>home.password</Trans></Button>
            </Box>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};