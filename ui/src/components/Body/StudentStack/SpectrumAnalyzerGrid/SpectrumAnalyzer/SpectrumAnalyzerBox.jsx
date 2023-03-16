import { Grid } from '@mui/material';
import { SpectrumAnalyzer } from '../../../../';
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { RuxContainer, RuxTooltip, RuxIcon, RuxPushButton, RuxButton, RuxPopUp, RuxRadioGroup, RuxRadio, RuxCheckboxGroup, RuxCheckbox } from '@astrouxds/react'
import { satellites } from '../../../../../constants';
import PropTypes from 'prop-types';
import SpecAHelp from '../../HelpModals/SpecAHelp';
import config from '../../../../../constants/config';
import { useSewApp } from '../../../../../context/sewAppContext';
import { githubCheck } from '../../../../../lib/github-check';
import { AnalyzerControl } from '../../../../';
import './SpectrumAnalyzer.css'
import useSound from 'use-sound';
import { selectSound } from '../../../../../audio';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;
// If this is github then use a local file instead
const specADataLocation = !githubCheck() ? `${ApiUrl}/data/spec_a` : './data/spec_a.json';

const canvasContainer = {
  position: 'relative',
   overflow: 'hidden',
};

export const SpectrumAnalyzerBox = (props) => {
  const [isHelpModalActive, setIsHelpModalActive] = useState(false);
  const [playSelectSound] = useSound(selectSound);
  const [isRfMode, setIsRfMode] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [currentAntennaInAnalyzer, setCurrentAntennaInAnalyzer] = useState(1)
  const [isTraceOn, setIsTraceOn] = useState(false);
  const [isMarkerOn, setIsMarkerOn] = useState(false);
  const sewAppCtx = useSewApp();
  const whichSpecA = props.canvasId.split('A')[1];

  const [dataAvailable, setDataAvailable] = useState(false)

  const [currentSpecAnalyzer, setCurrentSpecAnalyzer] = useState(false)

  const el = useRef(null)

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
    if (!specA || !specA.antenna_id){
      return;}
      setCurrentSpecAnalyzer(specA)
      setDataAvailable(true)
      setIsTraceOn(specA.isDrawHold);
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
    setCurrentSpecAnalyzer(_specA);

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
    setCurrentSpecAnalyzer(_specA);
    window.sewApp.announceSpecAChange(specA.whichUnit);
    sewAppCtx.updateSewApp();
  };

    // Used for holding max amplitude
  const handleHoldClick = () => {
    playSelectSound();
    if (typeof currentSpecAnalyzer.resetHoldData !== 'undefined') {
      currentSpecAnalyzer.resetHoldData();
      currentSpecAnalyzer.isDrawHold = !currentSpecAnalyzer.isDrawHold;
      setIsTraceOn(currentSpecAnalyzer.isDrawHold);
    }
  };

    // Used for marking max amplitude
    const handleMarkerClick = () => {
      playSelectSound();
      currentSpecAnalyzer.isDrawMarker = !currentSpecAnalyzer.isDrawMarker;
      setIsMarkerOn(currentSpecAnalyzer.isDrawMarker);
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
      <RuxContainer>
        <div slot='header' style={{ display: 'flex', justifyContent: 'space-between', }}>
          <div>Analyzer {props.unit}</div> 
          <RuxTooltip message='Spectrum Analyzer Help' placement='top'>
            <RuxIcon
              icon='help'
              size='20px'
              className='helpIcon'
              onClick={() => {
                setIsHelpModalActive(true);
              }}>
            </RuxIcon>
          </RuxTooltip>
        </div>
        <Grid container spacing={0}>
          <Grid item xs={11} textAlign={'center'}>
            
          </Grid>
          <Grid item xs={1} style={{display: 'flex', justifyContent: 'flex-end'}}>
            
          </Grid>
          <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right', paddingRight: '4px' }} xs={2}>
              <p style={{ fontSize: 'var(--font-body-2-font-size)' }}>{sewAppCtx.sewApp[`specA${whichSpecA}`]?.maxDecibels} (dB)</p>
              <p style={{ fontSize: 'var(--font-body-2-font-size)' }}>{sewAppCtx.sewApp[`specA${whichSpecA}`]?.minDecibels} (dB)</p>
          </Grid>
          <Grid sx={canvasContainer} item xs={10}>
              <canvas id={props.canvasId} />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
            <div>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', paddingRight: 'var(--spacing-2)' }}>
              Span: {sewAppCtx.sewApp[`specA${whichSpecA}`]?.bw / 1e6} MHz
              </span>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', color: 'var(--color-text-placeholder' }}>|</span>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', paddingLeft: 'var(--spacing-2)' }}>CF: {sewAppCtx.sewApp[`specA${whichSpecA}`]?.centerFreq / 1e6} MHz</span>
            </div>
            <RuxPushButton
                  size='small'
                  iconOnly
                  icon={sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? 'play-arrow' : 'pause'} 
                  // label={sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? 'Play' : 'Pause'} 
                  onRuxchange={() => handlePauseClicked()} 
                />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', }}>
              {/* <Typography pr={1} textAlign={'right'}>Frequency</Typography>
              <RuxSegmentedButton size='small' data={
                [
                  { label: "Intermediate", selected: true },
                  { label: "Radio" },
                ]
              }
              onRuxchange={handleRfClicked}
              /> */}
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', paddingTop: 'var(--spacing-2)' }}>
              
              {/* <RuxSegmentedButton size='small' data={
                  [
                    { label: "1", selected: true },
                    { label: "2" },
                  ]
                }
                onRuxchange={(e) =>
                  updateSpecAwAntennaInfo(parseInt(e.target.selected), sewAppCtx.sewApp[`specA${whichSpecA}`], false)
                }
              /> */}
            </Grid>
          </Grid>
        </Grid>
        <div slot='footer'>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: 'var(--font-body-2-font-size)' }}>
          <RuxPopUp 
            placement="bottom-start"
            ref={el}
          >
            <div slot='trigger'>
              <RuxButton
                style={{ }}
                iconOnly
                size='small'
                borderless
                icon="settings"
                onClick={() => {
                  playSelectSound();
                  setCurrentSpecAnalyzer(sewAppCtx.sewApp[`specA${whichSpecA}`])
                }}>
              </RuxButton>
            </div>
            { dataAvailable ?
               <div style={{ width: '528px', padding: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', }}>
                  <RuxRadioGroup
                    className='config-radio-group'
                    style={{ paddingRight: 'var(--spacing-8)' }}
                    name="Antennas" 
                    label="Antenna"
                    onRuxchange={(e) => {
                        updateSpecAwAntennaInfo(parseInt(e.target.value), sewAppCtx.sewApp[`specA${whichSpecA}`], false)
                        setCurrentAntennaInAnalyzer(e.target.value)
                      }
                    }
                  >
                    <RuxRadio value="1" name="Antennas">
                    Antenna 1
                    </RuxRadio>
                    <RuxRadio value="2" name="Antennas">
                    Antenna 2
                    </RuxRadio>
                  </RuxRadioGroup>
                  <RuxRadioGroup
                    className='config-radio-group'
                    style={{ paddingRight: 'var(--spacing-8)' }}
                    name="Frequency" 
                    label="Frequency"
                    onRuxchange={() => {
                      handleRfClicked()
                    }}
                  >
                    <RuxRadio value="Radio" name="Frequency">
                    Radio
                    </RuxRadio>
                    <RuxRadio value="Intermediate" name="Frequency">
                    Intermediate
                    </RuxRadio>
                  </RuxRadioGroup>
                  <RuxCheckboxGroup
                  className='config-checkbox-group'
                    name='viewOptions'
                    label='View Options'
                  >
                    <RuxCheckbox value='trace' name='viewOptions' checked={isTraceOn} onRuxchange={handleHoldClick}>
                      Trace
                    </RuxCheckbox>
                    <RuxCheckbox value='marker' name='viewOptions' checked={isMarkerOn} onRuxchange={handleMarkerClick}>
                      Marker
                    </RuxCheckbox>
                  </RuxCheckboxGroup>
                </div>

               <AnalyzerControl currentSpecAnalyzer={currentSpecAnalyzer} />
              </div> 
              : null
            }
          </RuxPopUp>
          <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', }}>Antenna {currentAntennaInAnalyzer}</span>
          <span style={{ color: 'var(--color-text-placeholder)', }}>|</span>
          <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', }}>{ isRfMode ? 'Radio' : 'Intermediate' }</span>
          <span style={{ color: 'var(--color-text-placeholder)', }}>|</span>
          <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', }}>{ isTraceOn ? 'Show Traces' : 'Hide Traces' }</span>
          <span style={{ color: 'var(--color-text-placeholder)', }}>|</span>
          <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)', }}>{ isMarkerOn ? 'Show Markers' : 'Hide Markers' }</span>
          </div>
        </div>
      </RuxContainer>
    </>
  );
};

SpectrumAnalyzerBox.propTypes = {
  unit: PropTypes.number,
  canvasId: PropTypes.any,
  currentSpecAnalyzer: PropTypes.any,
};
