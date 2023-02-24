import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CellTowerIcon from '@mui/icons-material/CellTower';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import { AstroTheme } from '../../../../../themes/AstroTheme';
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

  const sxHPA = {
    marginTop: '5px',
    border: sewAppCtx.antenna[antennaIdx].hpa ? '1px solid ' + AstroTheme.reference.colors.green500 : '1px solid ' + AstroTheme.system.colors.borderInteractiveDefault,
    backgroundColor: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.reference.colors.green500 : "none",
    color: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.typography.colors.black : AstroTheme.typography.colors.interactive,
    '&:hover': {
      border: sewAppCtx.antenna[antennaIdx].hpa ? '1px solid ' + AstroTheme.reference.colors.green400 : '1px solid ' + AstroTheme.system.colors.borderInteractiveHover,
      backgroundColor: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.reference.colors.green400 : "none",
      color: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
    },
  };
  const sxTx = {
    backgroundColor: sewAppCtx.antenna[antennaIdx].loopback
      ? AstroTheme.system.colors.backgroundSurfaceDefault
      : sewAppCtx.antenna[antennaIdx].hpa
      ? 'red'
      : 'green',
    borderRadius: '10px',
  };

  const sxLoopback = {
    width: '100px',
    backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
    border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
    padding: '10px 30px',
    marginTop: '-1px',
    marginBottom: '-1px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'calc(100% - 20px)',
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
    <Box sx={sxLoopback}>
      <Tooltip title='Intermediate Frequency'>
        <Typography align='center'>IF</Typography>
      </Tooltip>
      <Box sx={sxLoopbackSwitch} width={'100%'}>
        <Tooltip title='Loopback'>
          <SettingsBackupRestoreIcon />
        </Tooltip>
        <IconButton
          onClick={toggleSwitch}
          sx={{
            padding: '0px',
            width: '60%',
            '&:hover': {
              cursor: 'pointer',
            },
          }}>
          <img
            src={`baseball_switch${sewAppCtx.antenna[antennaIdx].loopback ? '' : '2'}.png`}
            alt='baseball_switch'
            style={{ width: '100%' }}
          />
        </IconButton>
        <Tooltip title='Antenna'>
          <CellTowerIcon sx={sxTx} />
        </Tooltip>
      </Box>
      <Tooltip title='Ground'>
        <AlignHorizontalCenterIcon />
      </Tooltip>
      <Tooltip
        title={!sewAppCtx.antenna[antennaIdx].hpa ? 'Enable High Powered Amplifier' : 'Disable High Powered Amplifier'}>
        <Button sx={sxHPA} onClick={(e) => handleHPA(e)}>
          <Typography>HPA</Typography>
        </Button>
      </Tooltip>
    </Box>
  );
};
LoopbackSwitch.propTypes = {
  unit: PropTypes.number.isRequired,
};
