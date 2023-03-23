import React from 'react';
import { RuxButton, RuxTooltip, RuxPushButton, RuxIcon } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
// import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
// import CellTowerIcon from '@mui/icons-material/CellTower';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import { useSewApp } from '../../../../../context/sewAppContext';
import { CRUDdataTable } from '../../../../../crud/crud';
// import useSound from 'use-sound';
// import { breakerSound, switchSound } from '../../../../../audio';

export const LoopbackSwitch = ({ unit }) => {
  // const [playSwitchSound] = useSound(switchSound);
  // const [playBreakerSound] = useSound(breakerSound);

  const sewAppCtx = useSewApp();
  const {lightMode} = sewAppCtx;
  const unitData = sewAppCtx.antenna.filter(
    (x) => x.unit == unit && x.team_id == sewAppCtx.user.team_id && x.server_id == sewAppCtx.user.server_id
  );
 const antennaIdx = sewAppCtx.antenna.map((x) => {
    return x.id}).indexOf(unitData[0].id);
  

  const sxTx = {
    color: sewAppCtx.antenna[antennaIdx].loopback
      ? 'var(--color-status-off)'
      : sewAppCtx.antenna[antennaIdx].hpa
      ? 'var(--color-status-critical)'
      : 'var(--color-status-normal)',
  };

  const sxLoopbackSwitch = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const toggleSwitch = () => {
    //playSwitchSound();
    const tmpData = [...sewAppCtx.antenna];
    const loopback = tmpData[antennaIdx].loopback;
    tmpData[antennaIdx].loopback = !loopback;
    sewAppCtx.updateAntenna([...tmpData]);
    CRUDdataTable({ method: 'PATCH', path: 'antenna', data: tmpData[antennaIdx] });
  };
  const handleHPA = (e) => {
    e.preventDefault()
    //playBreakerSound();
    const tmpData = [...sewAppCtx.antenna];
    const hpa = tmpData[antennaIdx].hpa;
    tmpData[antennaIdx].hpa = !hpa;
    sewAppCtx.updateAntenna([...tmpData]);
    CRUDdataTable({ method: 'PATCH', path: 'antenna', data: tmpData[antennaIdx] });
  };
  return (
    <div className='loopback_container'>
      <p style={{ textAlign: 'center' }}>Pathway Switch</p>
        <RuxTooltip className='loopback-tooltip' style={{ display: 'flex' }} message='Intermediate Frequency' strategy="fixed">
          <Typography align='center' style={{width: 'fit-contents', paddingLeft: '6px'}}>IF</Typography>
        </RuxTooltip>
        <Box sx={sxLoopbackSwitch} width={'100%'}>
          <RuxTooltip className='loopback-tooltip' message='Loopback' strategy="fixed">
            <RuxIcon icon="loop" size="24px" style={{ color: 'var(--color-text-primary)' }} />
          </RuxTooltip>
          <RuxButton
            className='loopback-button'
            borderless
            onClick={toggleSwitch}
            >
            {lightMode ?
                <img
                src={`light_baseball_switch${sewAppCtx.antenna[antennaIdx].loopback ? '' : '2'}.png`}
                alt='baseball_switch'
                style={{ width: '80px' }}
              />
              :
              <img
                src={`baseball_switch${sewAppCtx.antenna[antennaIdx].loopback ? '' : '2'}.png`}
                alt='baseball_switch'
                style={{ width: '80px' }}
              />
            }
          </RuxButton>
          <RuxTooltip className='loopback-tooltip' message='Antenna' strategy="fixed">
            <RuxIcon icon="antenna" size="24px" style={ sxTx } />
          </RuxTooltip>
        </Box>
        <RuxTooltip className='loopback-tooltip' message='Ground' style={{ display: 'flex', }} strategy="fixed">
          <AlignHorizontalCenterIcon style={{ display: 'flex', margin: '0 auto' }} />
        </RuxTooltip>
      
      <RuxTooltip
        message={!sewAppCtx.antenna[antennaIdx].hpa ? 'Enable High Powered Amplifier' : 'Disable High Powered Amplifier'}
        style={{ display: 'flex', }}
        >
        <RuxPushButton style={{textAlign: 'center', marginTop: 'var(--spacing-4)'}} label={sewAppCtx.antenna[antennaIdx].hpa ? 'Disable Amplifier' : 'Enable Amplifier'} onClick={(e) => handleHPA(e)} checked={sewAppCtx.antenna[antennaIdx].hpa} />
      </RuxTooltip>
    </div>
  );
};
LoopbackSwitch.propTypes = {
  unit: PropTypes.number.isRequired,
};
