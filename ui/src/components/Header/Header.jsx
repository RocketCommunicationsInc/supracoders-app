import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import GitHubIcon from '@mui/icons-material/GitHub';
import Logout from '@mui/icons-material/Logout';
import { AstroTheme } from '../../themes/AstroTheme';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, Modal, Tooltip, Switch } from '@mui/material';
import { sxModal } from '../styles/sxModal';

export const Header = () => {
  const [isHelpModalActive, setIsHelpModalActive] = useState(false);
  const { state } = useLocation();
  const theme = AstroTheme;
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  /*Add Theme Switcher*/
  const [checked, setChecked] = useState(false);
  useEffect(()=>{
    const body = document.querySelector('body');
    if(checked){
      body.classList.add('light-theme')
    } else {
      body.classList.remove('light-theme')
    } 
  },[checked])

  const light = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Brightness 5</title><path fillRule="evenodd" d="m22.6 12.71-2.6 2.6V19c0 .55-.45 1-1 1h-3.7l-2.6 2.6a.996.996 0 0 1-1.41 0L8.69 20H5c-.55 0-1-.45-1-1v-3.7l-2.6-2.6a.996.996 0 0 1 0-1.41L4 8.69V5c0-.55.45-1 1-1h3.69l2.61-2.6a.996.996 0 0 1 1.41 0l2.6 2.6H19c.55 0 1 .45 1 1v3.69l2.6 2.61c.39.39.39 1.02 0 1.41ZM6 12c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6-6 2.69-6 6Z"></path><metadata>5, brightness, circle, control, crescent, level, moon, screen, sun</metadata></svg>
  const dark = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Brightness 4</title><path fillRule="evenodd" d="m20 8.69 2.6 2.6c.39.39.39 1.03 0 1.42l-2.6 2.6V19c0 .55-.45 1-1 1h-3.7l-2.6 2.6a.996.996 0 0 1-1.41 0L8.69 20H5c-.55 0-1-.45-1-1v-3.7l-2.6-2.6a.996.996 0 0 1 0-1.41L4 8.69V5c0-.55.45-1 1-1h3.69l2.61-2.6a.996.996 0 0 1 1.41 0l2.6 2.6H19c.55 0 1 .45 1 1v3.69Zm-5.96 8.95a5.997 5.997 0 0 0 3.88-4.66c.05-.33.07-.66.08-.98 0-.32-.02-.65-.07-.98-.34-2.12-1.86-3.94-3.88-4.66a6.032 6.032 0 0 0-3.5-.18c-.42.11-.48.66-.13.9A5.97 5.97 0 0 1 13 12c0 2.04-1.02 3.84-2.59 4.92-.35.25-.28.8.13.9 1.09.27 2.29.25 3.5-.18Z"></path><metadata>4, brightness, circle, control, crescent, level, moon, screen, sun</metadata></svg>
  return (
    <>
      <Modal open={isHelpModalActive} onClose={() => setIsHelpModalActive(false)}>
        <Box sx={{ ...sxModal, ...{ color: AstroTheme.typography.colors.primary } }}>
          <Typography m={1} variant='h3'>
            IRIS Space Electronic Warfare Sandbox
          </Typography>
          <Typography m={1} variant='h5'>
            Introduction
          </Typography>
          <Typography ml={1} mr={1} variant='body1'>
            IRIS is a training environment to help learn how Space Electronic Warfare works. In front of you are:
          </Typography>
          <ul>
            <li>4x Spectrum Analyzers</li>
            <li>2x Antennas</li>
            <li>4x Transmitter Cases</li>
            <li>16x Transmitter Modems</li>
            <li>4x Receiver Cases</li>
            <li>16x Receiver Modems</li>
          </ul>
          <Typography ml={1} mr={1} variant='body1'>
            Using this equipment you can analyze satellites, determine the signals they are transmitting, view video
            feeds on those signals, and then generate your own signals to degrade or disable them.
          </Typography>
          <Typography m={1} variant='h5'>
            Example Scenario
          </Typography>
          <Typography ml={1} mr={1} mb={1} variant='body1'>
            Satellite ARKE 3G is currently transmitting a UAV video feed in C-Band at frequency 4810 Mhz. Intel
            assessment is that they are utilizing 8QAM modulation and a forward error correction (FEC) of 3/4.
          </Typography>
          <Typography ml={1} mr={1} mb={1} variant='body1'>
            Your transmitters and receivers operate with an intermediate frequency (IF) in L-Band. When they are
            converted to C-Band the IF will increase by 3350 Mhz. When it is then downcoverted back to L-Band it will
            decrease by 3500 Mhz.
          </Typography>
          <Typography ml={1} mr={1} variant='body1'>
            Since the satellite cannot transmit and receive on the same frequency, it will offset the frequency it
            receives by 400 Mhz. With all of this information, see if you can find the signal on ARKE 3G and disrupt it
            with your transmitters!
          </Typography>
          <Typography m={1} variant='h5'>
            Why So Much Equipment?
          </Typography>
          <Typography ml={1} mr={1} mb={1} variant='body1'>
            Students in the United States Space Force often work in teams sharing equipment. In order to accurate mimic
            this you have access to all of the equipment on your screen. If you are connected to a server (not Github)
            then your changes will impact other students in your server. If you are playing alone, then you most likely
            will not need all of the equipment.
          </Typography>
        </Box>
      </Modal>
      <AppBar className={'appBar'} position='static'>
        <Toolbar sx={{ backgroundColor: theme.system.colors.backgroundBaseHeader }}>
          <Grid container>
            <Grid item xs={'auto'}>
              <Tooltip title='Home' placement='bottom'>
                <Button onClick={() => navigate('/')}>
                  <img src='./patch.png' alt='patch.png' height='80px'></img>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={true} container spacing={1}>
              <Grid item xs={12} mt={-1} mb={-5}>
                <Typography fontSize={'64px'} fontFamily={'Nasa'} color={AstroTheme.typography.colors.primary}>
                  IRIS
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontSize={'24px'} sx={{ fontFamily: 'Nasa', color: AstroTheme.typography.colors.secondary }}>
                  Space Electronic Warfare Sandbox
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={'auto'}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
                <span className="switch-indicator" style={{height: '2.25rem', width: '2.25rem'}}>{checked ? light : dark}</span>
              <Switch
              id="light-dark-switch"
              checked={checked}
              onClick={()=>setChecked(!checked)} />
              <Tooltip title='View Code on Github' placement='bottom'>
                <IconButton target='_blank' href='http://github.com/thkruz/iris' size='large' sx={{ color: AstroTheme.typography.colors.primary}}>
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Help' placement='bottom'>
                <IconButton
                  size='large'
                  onClick={() => {
                    setIsHelpModalActive(true);
                  }}
                  sx={{ color: AstroTheme.typography.colors.primary}}>
                  <HelpCenterIcon />
                </IconButton>
              </Tooltip>
              {state?.isAuthenticated && (
                <Tooltip title='Logout' placement='bottom'>
                  <IconButton size='large' onClick={handleLogout} sx={{ color: AstroTheme.typography.colors.primary}}>
                    <Logout />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};
