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
    marginTop: AstroTheme.reference.spacing[4],
    width: 'fit-content',
    border: sewAppCtx.antenna[antennaIdx].hpa ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.borderInteractiveDefault,
    backgroundColor: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.reference.color.palette.green[500] : "none",
    color: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.typography.colors.black : AstroTheme.typography.colors.interactive,
    '&:hover': {
      border: sewAppCtx.antenna[antennaIdx].hpa ? '1px solid ' + AstroTheme.reference.color.palette.green[400] : '1px solid ' + AstroTheme.system.colors.borderInteractiveHover,
      backgroundColor: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.reference.color.palette.green[400] : "none",
      color: sewAppCtx.antenna[antennaIdx].hpa ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
    },
  };
  const sxTx = {
    color: sewAppCtx.antenna[antennaIdx].loopback
      ? AstroTheme.palette.disabled.main
      : sewAppCtx.antenna[antennaIdx].hpa
      ? AstroTheme.palette.normal.main
      : AstroTheme.palette.critical.main,
    borderRadius: AstroTheme.reference.radius.circle,
    padding: AstroTheme.reference.spacing[1],
  };

  const sxLoopback = {
    width: 'calc(var(--spacing-1) + var(--spacing-24))',
    backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
    border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
    //padding: '10px 30px',
    padding: 'calc(var(--spacing-050) + var(--spacing-2)) calc(var(--spacing-2) + var(--spacing-6))',
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
        <Typography sx={{ padding: AstroTheme.reference.spacing[1] }} align='center'>IF</Typography>
      </Tooltip>
      <Box sx={sxLoopbackSwitch} width={'100%'}>
        <Tooltip title='Loopback'>
          <SettingsBackupRestoreIcon sx={{ padding: AstroTheme.reference.spacing[1] }} />
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
        <AlignHorizontalCenterIcon sx={{ padding: AstroTheme.reference.spacing[1] }} />
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
