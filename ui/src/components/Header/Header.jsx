import React, { useEffect, useState }from 'react';
import { RuxGlobalStatusBar, RuxTooltip, RuxButton, RuxIcon, RuxPopUp, RuxMenu, RuxMenuItem, RuxDialog } from '@astrouxds/react'
// import IconButton from '@mui/material/IconButton';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { githubCheck } from '../../lib/github-check'
import { teams } from '../../constants';
import { useSewApp } from '../../context/sewAppContext';
import  HeaderHelp from './HeaderHelp'

export const Header = () => {
  const sewAppCtx = useSewApp();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [servers, setServers] = useState([]);
  const {lightMode, updateLightMode} =sewAppCtx

  useEffect(() => {
    if (!githubCheck()) {
      const { data: _servers } = fetch('data/server');
      setServers(_servers);
    } else {
      fetch('./data/server.json').then((res) =>
        res.json().then((data) => {
          setServers(data);
        })
      );
    }
  }, []);

  const handleLogout = () => {
    //reset app data
    sewAppCtx.resetSewApp();
    navigate('/');
  };

  const [signOutModal, setSignOutModal] = useState(false);
  const [loginOpenedFlag, setLoginOpenedFlag] = useState(false)
  const [modalState, setModalState] = useState(false);

  useEffect(()=>{
    const body = document.querySelector('body');
    if(lightMode){
      body.classList.add('light-theme')
    } else {
      body.classList.remove('light-theme')
    }
  },[lightMode])

  useEffect(() => {
    console.log(sewAppCtx.antenna)
  }, [sewAppCtx])
  

  return (
    <>
    <HeaderHelp modalState={modalState} setModalState={setModalState} />
      <RuxGlobalStatusBar
        style={{position: 'relative',}} 
        appDomain='IRIS' 
        appName='Space Electronic Warfare Sandox' 
        appState={ state?.isAuthenticated && 'ONLINE' } 
        username={ state?.isAuthenticated && servers[sewAppCtx.user.server_id - 1]?.name }>
        <div slot='left-side'>
          <RuxButton style={ state?.isAuthenticated && {marginBottom: '20px'} } className='iris-logo' borderless onClick={() => navigate('/')}>
            <img src='./patch.png' alt='patch.png' height='40px'></img>
          </RuxButton>
        </div>
        <div slot='right-side' style={{ display: 'flex', alignItems: 'center' }}>
       

          {state?.isAuthenticated && (
            <>
            <RuxDialog
              className='logout-modal'
              open={signOutModal} 
              header='Logout' 
              message='Sign out of application' 
              clickToClose 
              onRuxdialogclosed={()=>{setSignOutModal(false)}}
            >
            <div slot="footer">
                <rux-button-group h-align="right">
                    <rux-button secondary onClick={()=> {
                      setSignOutModal(false) 
                      }}>Cancel</rux-button>
                    <rux-button onClick={()=> {
                      setSignOutModal(false) 
                      handleLogout()
                      }}>Confirm</rux-button>
                </rux-button-group>
            </div>
            </RuxDialog>
            <RuxPopUp disableAutoUpdate placement="bottom-end" onRuxpopupopened={()=>{ setLoginOpenedFlag(true) }} onRuxpopupclosed={()=>{ setLoginOpenedFlag(false) }}>
              <div slot='trigger' style={{ display: 'flex', borderRight: '1px solid var(--color-text-placeholder)', paddingRight: 'var(--spacing-3)' }}>
                <RuxIcon icon="person" size="1.5rem" style={{ color: '#ffffff', paddingRight: 'var(--spacing-3)' }}/>
                <span style={{ color: 'var(--color-text-primary)', whiteSpace: 'nowrap', }}>{teams[sewAppCtx.user?.team_id - 1].name}</span>
                <RuxIcon icon={loginOpenedFlag ? 'arrow-drop-up' : 'arrow-drop-down'} size='24px' style={{paddingLeft: 'var(--spacing-1)'}} />
              </div>
              <RuxMenu>
                <RuxMenuItem>
                  <RuxButton className='menu-button' borderless icon='exit-to-app' onClick={() => { setSignOutModal(true) }}>
                    Logout
                  </RuxButton>
                </RuxMenuItem>
                <RuxMenuItem>
                  <RuxButton className='menu-button' borderless icon={lightMode ? "brightness-3" : "wb-sunny" } onClick={()=> updateLightMode()}>
                    {lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                  </RuxButton>
                </RuxMenuItem>
              </RuxMenu>
            </RuxPopUp>
            </>
          )}
          <RuxTooltip message='Help' placement='bottom'>
            <RuxButton iconOnly borderless icon="help"  onClick={() => {
                setModalState(true);
              }}
              style={{marginLeft: 'var(--spacing-3'}} />
          </RuxTooltip>
        </div>
      </RuxGlobalStatusBar>
    </>
  );
};
