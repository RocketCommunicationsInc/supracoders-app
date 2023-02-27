import { Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { SpectrumAnalyzer } from '../../../../';
import React, { useLayoutEffect, useState } from 'react';
import { AstroTheme } from '../../../../../themes/AstroTheme.js';
import { useEffect } from 'react';
import { satellites } from '../../../../../constants';
import PropTypes from 'prop-types';
import config from '../../../../../constants/config';
import { useSewApp } from '../../../../../context/sewAppContext';
import { githubCheck } from '../../../../../lib/github-check';
import SpecAHelp from '../../HelpModals/SpecAHelp';
import { InstructionsIcon } from './../../HelpModals/InstructionsIcon';
import useSound from 'use-sound';
import { selectSound } from '../../../../../audio';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;
// If this is github then use a local file instead
const specADataLocation = !githubCheck() ? `${ApiUrl}/data/spec_a` : './data/spec_a.json';

const SpectrumAnalyzerBoxStyle = {
  textAlign: 'center',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  borderRadius: AstroTheme.reference.radius.base,
  boxShadow: AstroTheme.system.shadow.overlay,
  color: AstroTheme.typography.colors.primary,
  backgroundColor: AstroTheme.system.colors.backgroundSurfaceDefault,
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  overflow: 'hidden',
  position: 'relative',
  zIndex: '1',
};
const sxInputRow = {
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  textAlign: 'left',
  margin: '8px',
  height: '30px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1em',
};
const configButtonStyle = {
  backgroundColor: AstroTheme.system.colors.backgroundInteractiveDefault,
  //boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
  color: AstroTheme.typography.colors.inverse,
  margin: '8px',
  cursor: 'pointer',
  textTransform: 'Capitalize',
};
const canvasContainer = {
  position: 'relative',
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  //borderImageSource: 'url(./bezel.png)',
  //borderImageSlice: '30 fill',
  //borderImageOutset: 0,
  overflow: 'hidden',
  //boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
  backgroundColor: '#282a2b',
  borderRadius: AstroTheme.reference.radius.base,
};

export const SpectrumAnalyzerBox = (props) => {
  const [playSelectSound] = useSound(selectSound);
  const [isHelpModalActive, setIsHelpModalActive] = useState(false);
  const [isRfMode, setIsRfMode] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const sewAppCtx = useSewApp();
  const whichSpecA = props.canvasId.split('A')[1];

  useEffect(() => {
    window.sewApp.socket?.on('updateSpecA', (data) => {
      // We need to reference the global variable here
      // NOT the context object
      const specA = window.sewApp[`specA${whichSpecA}`];
      console.log('updateSpecA', data);
      if (specA.whichUnit === data.unit) {
        // TODO: Account for team
        specA.isRfMode = data.number === 2 ? true : false; // If we changed an RF Mode row of data we must be in RF Mode now
        if (specA.isRfMode) {
          specA.config.rf.freq = data.frequency * 1e6;
          specA.config.rf.span = data.span * 1e6;
        } else {
          specA.config.if.freq = data.frequency * 1e6;
          specA.config.if.span = data.span * 1e6;
        }
        specA.isDrawHold = data.hold;
        specA.antenna_id = data.antenna_id;
        const { target_id } = sewAppCtx.antenna[specA.antenna_id - 1];
        specA.target_id = target_id;

        specA.changeCenterFreq(specA.isRfMode ? specA.config.rf.freq : specA.config.if.freq);
        specA.changeBandwidth(specA.isRfMode ? specA.config.rf.span : specA.config.if.span);

        window.sewApp[`specA${whichSpecA}`] = specA;
        sewAppCtx.updateSewApp();
      }
    });
  }, []);

  useLayoutEffect(() => {
    const canvasDom = document.getElementById(props.canvasId);
    canvasDom.width = canvasDom.parentElement.offsetWidth - 6;
    canvasDom.height = canvasDom.parentElement.offsetWidth - 6;
    const defaultSpecAConfig = {
      whichUnit: parseInt(props.canvasId.split('A')[1]),
      minDecibels: -120,
      maxDecibels: -80,
      minFreq: 4650000000,
      maxFreq: 4750000000,
      refreshRate: 10, // per second
      noiseFloor: -115,
      isShowSignals: false,
      locked: false,
      operational: false,
    };

    fetch(specADataLocation).then((res) => {
      res.json().then((data) => {
        const specA = new SpectrumAnalyzer(canvasDom, defaultSpecAConfig);

        data = data.filter((specA_DB) => specA_DB.unit === specA.whichUnit && specA_DB.team_id === 1); // TODO Allow other teams!
        const ifData = data.filter((specA_DB) => !specA_DB.rf)[0];
        const rfData = data.filter((specA_DB) => specA_DB.rf)[0];
        specA.config = {
          if: {
            id: ifData.id,
            freq: ifData.frequency * 1e6, // MHz to Hz
            span: ifData.span * 1e6, // MHz to Hz
          },
          rf: {
            id: rfData.id,
            freq: rfData.frequency * 1e6, // MHz to Hz
            span: rfData.span * 1e6, // MHz to Hz
          },
        };

        specA.antenna_id = data[0].antenna_id;
        const { target_id } = sewAppCtx.antenna[specA.antenna_id - 1];
        specA.target_id = target_id;

        specA.changeCenterFreq(specA.isRfMode ? specA.config.rf.freq : specA.config.if.freq);
        specA.changeBandwidth(specA.isRfMode ? specA.config.rf.span : specA.config.if.span);

        loadSignals(specA);
        specA.start();

        window.sewApp[`specA${whichSpecA}`] = specA;
        window[`specA${whichSpecA}`] = specA;
        sewAppCtx.updateSewApp();
      });
    });
  }, []);

  const loadSignals = (specA) => {
    if (window.sewApp.environment.signals.length > 0) {
      window.sewApp.environment.signals.forEach((signal) => {
        specA.signals.push({
          rf: true,
          freq: signal.frequency * 1e6,
          amp: signal.power,
          bw: signal.bandwidth * 1e6,
          target_id: signal.target_id,
        });
      });
      window.sewApp[`specA${whichSpecA}`] = specA;
      sewAppCtx.updateSewApp();
    } else {
      setTimeout(() => {
        loadSignals(specA);
      }, 1000);
    }
  };

  useEffect(() => {
    const specA = sewAppCtx.sewApp[`specA${whichSpecA}`];
    if (!specA || !specA.antenna_id) return;
    const { target_id } = sewAppCtx.antenna[specA.antenna_id - 1];
    specA.target_id = target_id;
    sewAppCtx.updateSewApp();
  }, [sewAppCtx.antenna, sewAppCtx.sewApp[`specA${whichSpecA}`]]);

  const handleRfClicked = () => {
    playSelectSound();
    const specA = sewAppCtx.sewApp[`specA${whichSpecA}`];
    specA.isRfMode = !specA.isRfMode;
    specA.changeCenterFreq(specA.isRfMode ? specA.config.rf.freq : specA.config.if.freq);
    specA.changeBandwidth(specA.isRfMode ? specA.config.rf.span : specA.config.if.span);
    setIsRfMode(!isRfMode);
    const _specA = window.sewApp[`specA${specA.canvas.id.split('A')[1]}`];
    _specA.isRfMode = !isRfMode;
    props.handleRfClick(_specA);

    window.sewApp.announceSpecAChange(specA.whichUnit);
    sewAppCtx.updateSewApp();
  };

  const handlePauseClicked = () => {
    playSelectSound();
    const specA = sewAppCtx.sewApp[`specA${whichSpecA}`];
    specA.isPause = !specA.isPause;
    setIsPause(!isPause);
    const _specA = window.sewApp[`specA${specA.canvas.id.split('A')[1]}`];
    _specA.isPause = !isPause;
    props.handlePauseClicked(_specA);
    window.sewApp.announceSpecAChange(specA.whichUnit);
    sewAppCtx.updateSewApp();
  };

  useEffect(() => {
    updateSpecAwAntennaInfo();
  }, [sewAppCtx.antenna]);

  const updateSpecAwAntennaInfo = (antenna_id, specA, isRemoteChange = true) => {
    specA ??= window.sewApp[`specA${whichSpecA}`];
    if (!specA) return;
    antenna_id ??= specA.antenna_id;

    specA.antenna_id = antenna_id;
    let { band, hpa, target_id, locked, loopback, offset, operational } = sewAppCtx.antenna[specA.antenna_id - 1];
    specA.target_id = target_id;
    //console.log('updateSpecAwAntennaInfo', specA.antenna_id, specA.target_id);
    //console.log(antenna);

    specA.hpa = hpa;
    specA.loopback = loopback;
    specA.locked = locked;
    specA.operational = operational;

    band = band === 0 ? 'c' : 'ku';
    const bandOffset = window.sewApp.constants.antennas.filter((antenna) => antenna.band.toLowerCase() === band)[0];
    specA.downconvertOffset = bandOffset.downconvert;
    specA.upconvertOffset = bandOffset.upconvert;
    if (!loopback) {
      // RF Settings
      specA.targetOffset = satellites.filter((target) => target.id === target_id)[0].offset;
    } else {
      // IF Settings
      specA.antennaOffset = offset * 1e6;
    }
    window.sewApp[`specA${whichSpecA}`] = specA;
    if (!isRemoteChange) {
      // Dont tell anyone else if they made the change
      window.sewApp.announceSpecAChange(specA.whichUnit);
    }
    sewAppCtx.updateSewApp();
  };

  return (
    <>
      <SpecAHelp modalState={isHelpModalActive} setModalState={setIsHelpModalActive} />
      <Box sx={SpectrumAnalyzerBoxStyle}>
        <Grid container spacing={0}>
          <Grid item xs={11} pl={10}>
            <Typography>Span: {sewAppCtx.sewApp[`specA${whichSpecA}`]?.bw / 1e6} MHz</Typography>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title='Spectrum Analyzer Help' placement='top' sx={{
                '& svg': {
                  color: AstroTheme.system.colors.backgroundInteractiveDefault,
                } 
              }}>
              <IconButton 
                size='small'
                onClick={() => {
                  setIsHelpModalActive(true);
                }}>
                <InstructionsIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid container item sx={{ display: 'flex', alignContent: 'space-between' }} xs={2}>
            <Grid item xs={12}>
              <Typography>{sewAppCtx.sewApp[`specA${whichSpecA}`]?.maxDecibels} (dB)</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{sewAppCtx.sewApp[`specA${whichSpecA}`]?.minDecibels} (dB)</Typography>
            </Grid>
          </Grid>
          <Grid container item sx={canvasContainer} xs={9}>
            <canvas id={props.canvasId} />
          </Grid>
          <Grid item xs={12}>
            <Typography>CF: {sewAppCtx.sewApp[`specA${whichSpecA}`]?.centerFreq / 1e6} MHz</Typography>
          </Grid>
          <Grid item xs={3}>
            <Box sx={sxInputRow}>
              <label htmlFor='Antenna'>Ant</label>
              <select
                name='Antenna'
                value={sewAppCtx.sewApp[`specA${whichSpecA}`]?.antenna_id}
                onChange={(e) =>
                  updateSpecAwAntennaInfo(parseInt(e.target.value), sewAppCtx.sewApp[`specA${whichSpecA}`], false)
                }>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title='Open Spectrum Analyzer Configuration'>
              <Button
                sx={{...configButtonStyle,
                ...{'&:hover': {
                  backgroundColor: AstroTheme.system.colors.backgroundInteractiveHover,
                },}
                }}
                onClick={() => {
                  playSelectSound();
                  props.handleConfigClick(
                    sewAppCtx.sewApp[`specA${whichSpecA}`],
                    sewAppCtx.sewApp[`specA${whichSpecA}`]
                  );
                }}>
                Config
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip
              title={
                sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode
                  ? 'Switch to Intermediate Frequency'
                  : 'Switch to Radio Frequency'
              }>
              <Button
                sx={{
                  ...configButtonStyle,
                  ...{
                    backgroundColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? AstroTheme.reference.color.palette.green[500] : 'transparent',
                    color: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? AstroTheme.typography.colors.black : AstroTheme.system.colors.textInteractiveDefault,
                    border: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveDefault,
                    '&:hover': {
                      borderColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? AstroTheme.reference.color.palette.green[400] : AstroTheme.system.colors.borderInteractiveHover,
                      backgroundColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? AstroTheme.reference.color.palette.green[400] : 'transparent',
                      color: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? AstroTheme.typography.colors.black : AstroTheme.system.colors.textInteractiveHover,
                    },
                  },
                }}
                onClick={handleRfClicked}>
                {sewAppCtx.sewApp[`specA${whichSpecA}`]?.isRfMode ? 'RF' : 'IF'}
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip
              title={
                sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause
                  ? 'Unpause the Spectrum Analyzer'
                  : 'Pause the Spectrum Analyzer'
              }>
              <Button
                sx={{
                  ...configButtonStyle,
                  ...{
                    backgroundColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? AstroTheme.reference.color.palette.green[500] : 'transparent',
                    color: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? AstroTheme.typography.colors.black : AstroTheme.system.colors.textInteractiveDefault,
                    border: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.borderInteractiveDefault,
                    '&:hover': {
                        borderColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? AstroTheme.reference.color.palette.green[400] : AstroTheme.system.colors.borderInteractiveHover,
                        backgroundColor: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? AstroTheme.reference.color.palette.green[400] : 'transparent',
                        color: sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? AstroTheme.typography.colors.black : AstroTheme.system.colors.textInteractiveHover,
                    },
                  },
                }}
                onClick={handlePauseClicked}>
                Pause
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

SpectrumAnalyzerBox.propTypes = {
  canvasId: PropTypes.any,
  handleConfigClick: PropTypes.any,
  handleRfClick: PropTypes.any,
  handlePauseClicked: PropTypes.any,
};
