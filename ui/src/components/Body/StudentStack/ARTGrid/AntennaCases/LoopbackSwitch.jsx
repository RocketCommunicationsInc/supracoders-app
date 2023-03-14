import React from 'react';
import { RuxCard, RuxButton, RuxTooltip, RuxSwitch, RuxIcon } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
// import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
// import CellTowerIcon from '@mui/icons-material/CellTower';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import { useSewApp } from '../../../../../context/sewAppContext';
import { CRUDdataTable } from '../../../../../crud/crud';
import useSound from 'use-sound';
import { breakerSound, switchSound } from '../../../../../audio';

export const LoopbackSwitch = ({ unit }) => {
  const [playSwitchSound] = useSound(switchSound);
  const [playBreakerSound] = useSound(breakerSound);

  const sewAppCtx = useSewApp();
  const unitData = sewAppCtx.antenna.filter(
    (x) => x.unit == unit && x.team_id == sewAppCtx.user.team_id && x.server_id == sewAppCtx.user.server_id
  );
  const antennaIdx = sewAppCtx.antenna.map((x) => x.id).indexOf(unitData[0].id);

  const sxTx = {
    color: sewAppCtx.antenna[antennaIdx].loopback
      ? 'var(--color-status-off)'
      : sewAppCtx.antenna[antennaIdx].hpa
      ? 'var(--color-status-critical)'
      : 'var(--color-status-normal)',
    borderRadius: 'var(--radius-circle)',
  };

  const sxLoopbackSwitch = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const toggleSwitch = () => {
    playSwitchSound();
    const tmpData = [...sewAppCtx.antenna];
    const loopback = tmpData[antennaIdx].loopback;
    tmpData[antennaIdx].loopback = !loopback;
    sewAppCtx.updateAntenna([...tmpData]);
    CRUDdataTable({ method: 'PATCH', path: 'antenna', data: tmpData[antennaIdx] });
  };
  const handleHPA = () => {
    playBreakerSound();
    const tmpData = [...sewAppCtx.antenna];
    const hpa = tmpData[antennaIdx].hpa;
    tmpData[antennaIdx].hpa = !hpa;
    sewAppCtx.updateAntenna([...tmpData]);
    CRUDdataTable({ method: 'PATCH', path: 'antenna', data: tmpData[antennaIdx] });
  };
  return (
    <RuxCard className='loopback_container'>
      <p style={{ textAlign: 'center' }}>Pathway Switch</p>
        <RuxTooltip style={{ display: 'flex' }} message='Intermediate Frequency'>
          <Typography align='center'>IF</Typography>
        </RuxTooltip>
        <Box sx={sxLoopbackSwitch} width={'100%'}>
          <RuxTooltip message='Loopback'>
            <RuxIcon icon="loop" size="24px" style={{ color: 'var(--color-text-primary)' }} />
          </RuxTooltip>
          <RuxButton
            borderless
            onClick={toggleSwitch}
            >
            <img
              src={`baseball_switch${sewAppCtx.antenna[antennaIdx].loopback ? '' : '2'}.png`}
              alt='baseball_switch'
              style={{ width: '80px' }}
            />
          </RuxButton>
          <RuxTooltip message='Antenna'>
            <RuxIcon icon="antenna" size="24px" style={ sxTx } />
            {/* <CellTowerIcon sx={sxTx} /> */}
          </RuxTooltip>
        </Box>
        <RuxTooltip message='Ground' style={{ display: 'flex', }}>
          <AlignHorizontalCenterIcon style={{ display: 'flex', justifyContent: 'center', width: '100%', }} />
        </RuxTooltip>
      
      <RuxTooltip
        message={!sewAppCtx.antenna[antennaIdx].hpa ? 'Enable High Powered Amplifier' : 'Disable High Powered Amplifier'}
        style={{ display: 'flex', }}
        >
        <RuxSwitch style={{ marginLeft: '0' }} label='High Powered Amplifier' onRuxchange={(e) => handleHPA(e)}></RuxSwitch>
        {/* <RuxPushButton label='HPA' onRuxchange={(e) => handleHPA(e)} style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-2)', }} /> */}
      </RuxTooltip>
    </RuxCard>
  );
};
LoopbackSwitch.propTypes = {
  unit: PropTypes.number.isRequired,
};
