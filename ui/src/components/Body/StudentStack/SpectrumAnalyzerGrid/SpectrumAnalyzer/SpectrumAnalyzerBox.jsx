/* eslint-disable no-unused-vars */
import { Grid } from '@mui/material';
import { SpectrumAnalyzer } from '../../../../';
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  RuxContainer,
  RuxIcon,
  RuxButtonGroup,
  RuxButton,
  RuxPopUp,
  RuxRadioGroup,
  RuxRadio,
  RuxCheckboxGroup,
  RuxCheckbox,
  RuxInput,
  RuxSelect,
  RuxOption,
} from '@astrouxds/react';
import { satellites } from '../../../../../constants';
import PropTypes from 'prop-types';
import SpecAHelp from '../../HelpModals/SpecAHelp';
import config from '../../../../../constants/config';
import { useSewApp } from '../../../../../context/sewAppContext';
import { githubCheck } from '../../../../../lib/github-check';
// import { AnalyzerControl } from '../../../../';
import './SpectrumAnalyzer.css';
import useSound from 'use-sound';
import { selectSound } from '../../../../../audio';
import { AstroTheme } from '../../../../../themes/AstroTheme';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;
// If this is github then use a local file instead
const specADataLocation = !githubCheck() ? `${ApiUrl}/data/spec_a` : './data/spec_a.json';

export const SpectrumAnalyzerBox = (props) => {
  const [isHelpModalActive, setIsHelpModalActive] = useState(false);
  const [playSelectSound] = useSound(selectSound);
  const [isRfMode, setIsRfMode] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [currentAntennaInAnalyzer, setCurrentAntennaInAnalyzer] = useState(1);
  const [initialIfFreq, setInitialIfFreq] = useState(null)
  const [initialIfSpan, setInitialIfSpan] = useState(null)
  const [cfGhz, setCfGhz] = useState(null);
  const [cfMhz, setCfMhz] = useState(null);
  const [cfKhz, setCfKhz] = useState(null);
  const [spanGhz, setSpanGhz] = useState(null);
  const [spanMhz, setSpanMhz] = useState(null);
  const [spanKhz, setSpanKhz] = useState(null);
  const [currentCenterFrequency, setCurrentCenterFrequency] = useState(null);
  const [currentSpan, setCurrentSpan] = useState(null);
  const [cfHertzSelection, setcfHertzSelection] = useState('cfMhz');
  const [spanHertzSelection, setspanHertzSelection] = useState('spanMhz');
  const [isTraceOn, setIsTraceOn] = useState(false);
  const [isMarkerOn, setIsMarkerOn] = useState(false);
  const sewAppCtx = useSewApp();
  const whichSpecA = props.canvasId.split('A')[1];
  const {lightMode} = sewAppCtx

  const [dataAvailable, setDataAvailable] = useState(false);

  const [currentSpecAnalyzer, setCurrentSpecAnalyzer] = useState(false);

  const el = useRef(null);
  const antenna = useRef(null);
  const radio = useRef(null);
  const trace = useRef(null);
  const marker = useRef(null);
  const spanInput = useRef(null);
  const cfInput = useRef(null);
  const cfSelect = useRef(null);
  const spanSelect = useRef(null);

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
      width: '100%',
      height: '100%'
    }
   

    fetch(specADataLocation).then((res) => {
      res.json().then((data) => {
        const specA = new SpectrumAnalyzer(canvasDom, defaultSpecAConfig);

        data = data.filter((specA_DB) => specA_DB.unit === specA.whichUnit && specA_DB.team_id === 1); // TODO Allow other teams!
        const ifData = data.filter((specA_DB) => !specA_DB.rf)[0];
        const rfData = data.filter((specA_DB) => specA_DB.rf)[0];
        setInitialIfFreq(ifData.frequency * 1e6)
        setInitialIfSpan(ifData.span * 1e6)
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
    if (!specA || !specA.antenna_id) {
      return;
    }
    specA.noiseColor = lightMode ? '#6058A8' : '#00C7CB' 
    specA.backgroundColor = lightMode ? '#EAEEF4' : '#101923'
    specA.fillColor = lightMode ? '#000' : '#fff'
    setCurrentSpecAnalyzer(specA);
    setDataAvailable(true);
    setIsRfMode(specA.isRfMode);
    setCurrentCenterFrequency(specA.isRfMode / 1e6 ? specA.config.rf.freq : specA.config.if.freq / 1e6);
    setCurrentSpan(specA.isRfMode ? specA.config.rf.span / 1e6 : specA.config.if.span / 1e6);
    !cfGhz && setCfGhz(specA.isRfMode ? specA.config.rf.freq / 1e9 : specA.config.if.freq / 1e9);
    !cfMhz && setCfMhz(specA.isRfMode ? specA.config.rf.freq / 1e6 : specA.config.if.freq / 1e6);
    !cfKhz && setCfKhz(specA.isRfMode ? specA.config.rf.freq / 1e3 : specA.config.if.freq / 1e3);
    !spanGhz && setSpanGhz(specA.isRfMode ? specA.config.rf.span / 1e9 : specA.config.if.span / 1e9);
    !spanMhz && setSpanMhz(specA.isRfMode ? specA.config.rf.span / 1e6 : specA.config.if.span / 1e6);
    !spanKhz && setSpanKhz(specA.isRfMode ? specA.config.rf.span / 1e3 : specA.config.if.span / 1e3);
    setIsTraceOn(specA.isDrawHold);
    const { target_id } = sewAppCtx.antenna[specA.antenna_id - 1];
    specA.target_id = target_id;
    sewAppCtx.updateSewApp();
  }, [sewAppCtx.antenna, sewAppCtx.sewApp[`specA${whichSpecA}`], lightMode]);

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
  const handleHold = (checked) => {
    if (typeof currentSpecAnalyzer.resetHoldData !== 'undefined') {
      !isTraceOn && checked && currentSpecAnalyzer.resetHoldData();
      checked ? (currentSpecAnalyzer.isDrawHold = true) : (currentSpecAnalyzer.isDrawHold = false);
      setIsTraceOn(currentSpecAnalyzer.isDrawHold);
    }
  };

  // Used for marking max amplitude
  const handleMarker = (checked) => {
    checked ? (currentSpecAnalyzer.isDrawMarker = true) : (currentSpecAnalyzer.isDrawMarker = false);
    setIsMarkerOn(currentSpecAnalyzer.isDrawMarker);
  };

  const hertzConverter = (spanOrFreq, number) => {
    if (spanOrFreq === 'freq') {
      setCfMhz(number / 1e6)
      setCfGhz(((parseFloat(number, 10)) / 1e6) / 1e3);
      setCfKhz(((parseFloat(number, 10)) / 1e6) * 1e3);
    } else {
      setSpanMhz(number / 1e6)
      setSpanGhz(((parseFloat(number, 10)) / 1e6) / 1e3);
      setSpanKhz(((parseFloat(number, 10)) / 1e6) * 1e3);
    }
  }

  const swapToMhz = () => {
    // swap selection back to hertz if not there already
    cfHertzSelection !== 'cfMhz' && setcfHertzSelection('cfMhz')
    spanHertzSelection !== 'spanMhz' && setspanHertzSelection('spanMhz')
  }

  const handleRadioFrequency = (e) => {
    const specA = sewAppCtx.sewApp[`specA${whichSpecA}`];
    if (e.target.value === 'Radio') {
      //if radio, switch to Rf mode, change selection to Mhz
      specA.isRfMode = true;
      swapToMhz()

      //set hertz states to rf values for all

      //cf states
      hertzConverter('freq', specA.config.rf.freq)

      //span states
      hertzConverter('span', specA.config.rf.span)

    } else {
      //if intermediate, switch to If mode, change selection to Mhz
      specA.isRfMode = false;
      setcfHertzSelection('cfMhz')

      //set hertz states to If values for all

      //cf states
      hertzConverter('freq', specA.config.if.freq)

      //span states
      hertzConverter('span', specA.config.if.span)
    }
  }

  const handleInputSpanChange = (value) => {
    let _spanGhz, _spanMhz, _spanKhz;
    if (spanHertzSelection === 'spanGhz') {
      _spanGhz = spanGhz;
      _spanGhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setSpanGhz(parseFloat(_spanGhz, 10));
      setSpanMhz(parseFloat(_spanGhz, 10) * 1e3);
      setSpanKhz(parseFloat(_spanGhz, 10) * 1e6);
    } else if (spanHertzSelection === 'spanMhz') {
      _spanMhz = spanMhz;
      _spanMhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setSpanMhz(parseFloat(_spanMhz, 10));
      setSpanGhz(parseFloat(_spanMhz, 10) / 1e3);
      setSpanKhz(parseFloat(_spanMhz, 10) * 1e3);
    } else if (spanHertzSelection === 'spanKhz') {
      _spanKhz = spanKhz;
      _spanKhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setSpanKhz(parseFloat(_spanKhz, 10));
      setSpanGhz(parseFloat(_spanKhz, 10) / 1e6);
      setSpanMhz(parseFloat(_spanKhz, 10) / 1e3);
    }
    window.sewApp.announceSpecAChange(currentSpecAnalyzer.whichUnit);
  };

  const handleInputFreqChange = (value) => {
    let _cfGhz, _cfMhz, _cfKhz;
    if (cfHertzSelection === 'cfGhz') {
      _cfGhz = cfGhz;
      _cfGhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setCfGhz(parseFloat(_cfGhz, 10));
      setCfMhz(parseFloat(_cfGhz, 10) * 1e3);
      setCfKhz(parseFloat(_cfGhz, 10) * 1e6);
    } else if (cfHertzSelection === 'cfMhz') {
      _cfMhz = cfMhz;
      _cfMhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setCfMhz(parseFloat(_cfMhz, 10));
      setCfGhz(parseFloat(_cfMhz, 10) / 1e3);
      setCfKhz(parseFloat(_cfMhz, 10) * 1e3);
    } else if (cfHertzSelection === 'cfKhz') {
      _cfKhz = cfKhz;
      _cfKhz = value;

      //setting the state values so that they all update according to the one that changed on selection change (these state values do not update the Analyzer)
      setCfKhz(parseFloat(_cfKhz, 10));
      setCfGhz(parseFloat(_cfKhz, 10) / 1e6);
      setCfMhz(parseFloat(_cfKhz, 10) / 1e3);
    }
    window.sewApp.announceSpecAChange(currentSpecAnalyzer.whichUnit);
  };

  const handleApplyClick = () => {
    const specA = sewAppCtx.sewApp[`specA${whichSpecA}`];

    //set radio frequency state
    specA.isRfMode ? setIsRfMode(true) : setIsRfMode(false);

    //set Antenna state for display and analyzer update
    updateSpecAwAntennaInfo(parseInt(antenna.current.value), sewAppCtx.sewApp[`specA${whichSpecA}`], false);
    setCurrentAntennaInAnalyzer(antenna.current.value);

    //set Marker on if checked
    handleMarker(marker.current.checked);

    //set trace on if checked
    handleHold(trace.current.checked);

    //set center frequency based on hertz selection and inout value
    switch (cfHertzSelection) {
      case 'cfGhz':
        currentSpecAnalyzer.changeCenterFreq(parseFloat(cfGhz * 1e9));
        setCurrentCenterFrequency(cfGhz);
        setCfGhz(cfGhz);
        break;
      case 'cfMhz':
        currentSpecAnalyzer.changeCenterFreq(parseFloat(cfMhz * 1e6));
        setCurrentCenterFrequency(cfMhz);
        setCfMhz(cfMhz);
        break;
      case 'cfKhz':
        currentSpecAnalyzer.changeCenterFreq(parseFloat(cfKhz * 1e3));
        setCurrentCenterFrequency(cfKhz);
        setCfKhz(cfKhz);
        break;
      default:
    }

    //set span based on hertz selection and inout value
    switch (spanHertzSelection) {
      case 'spanGhz':
        currentSpecAnalyzer.changeBandwidth(parseFloat(spanGhz * 1e9));
        setCurrentSpan(spanGhz);
        break;
      case 'spanMhz':
        currentSpecAnalyzer.changeBandwidth(parseFloat(spanMhz * 1e6));
        setCurrentSpan(spanMhz);
        break;
      case 'spanKhz':
        currentSpecAnalyzer.changeBandwidth(parseFloat(spanKhz * 1e3));
        setCurrentSpan(spanKhz);
        break;
      default:
    }

    window.sewApp.announceSpecAChange(specA.whichUnit);
    sewAppCtx.updateSewApp();
  };

  const handleResetClick = () => {
    currentSpecAnalyzer.changeCenterFreq(initialIfFreq);
    setCurrentCenterFrequency(initialIfFreq / 1e6);

    currentSpecAnalyzer.changeBandwidth(initialIfSpan);
    setCurrentSpan(initialIfSpan);

    //converts other states to match
    hertzConverter('freq', initialIfFreq)
    hertzConverter('span', initialIfSpan)

    // swap selection back to hertz if not there already
    cfHertzSelection !== 'cfMhz' && setcfHertzSelection('cfMhz')
    spanHertzSelection !== 'spanMhz' && setspanHertzSelection('spanMhz')

    //set IsRfMode to false
    currentSpecAnalyzer.isRfMode = false
    setIsRfMode(false)
    radio.current.value = 'Intermediate'

    //remove trace and markers
    handleMarker(false)
    handleHold(false)
  }

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
      <RuxContainer className="container__analyzer">
        <div slot='header' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Analyzer {props.unit}</div>
          <RuxIcon
            icon='help'
            size='20px'
            className='helpIcon'
            onClick={() => {
              setIsHelpModalActive(true);
            }}></RuxIcon>
        </div>
        <Grid container spacing={0}>
          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'right',
              paddingRight: '4px',
            }}
            xs={2}>
            <p style={{ fontSize: 'var(--font-body-2-font-size)' }}>
              {sewAppCtx.sewApp[`specA${whichSpecA}`]?.maxDecibels} (dB)
            </p>
            <p style={{ fontSize: 'var(--font-body-2-font-size)' }}>
              {sewAppCtx.sewApp[`specA${whichSpecA}`]?.minDecibels} (dB)
            </p>
          </Grid>
          <Grid style={{position: 'relative', overflow: 'hidden', height: 'calc(100% - 36px)', minHeight:'220px'}} item xs={10}>
            <div className="canvas-container">
              <canvas id={props.canvasId} />
            </div>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', paddingRight: 'var(--spacing-2)' }}>
                Span: {spanHertzSelection === 'spanGhz' ? sewAppCtx.sewApp[`specA${whichSpecA}`]?.bw / 1e9 : spanHertzSelection === 'spanMhz' ? sewAppCtx.sewApp[`specA${whichSpecA}`]?.bw / 1e6 : sewAppCtx.sewApp[`specA${whichSpecA}`]?.bw / 1e3}{' '}
                {spanHertzSelection === 'spanGhz' ? 'GHz' : spanHertzSelection === 'spanMhz' ? 'MHz' : 'KHz'}
              </span>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', color: 'var(--color-text-placeholder', paddingRight: 'var(--spacing-2)', }}>|</span>
              <span style={{ fontSize: 'var(--font-body-2-font-size)', paddingRight: 'var(--spacing-2)', }}>
                CF: {cfHertzSelection === 'cfGhz' ? sewAppCtx.sewApp[`specA${whichSpecA}`]?.centerFreq / 1e9 : cfHertzSelection === 'cfMhz' ? sewAppCtx.sewApp[`specA${whichSpecA}`]?.centerFreq / 1e6 : sewAppCtx.sewApp[`specA${whichSpecA}`]?.centerFreq / 1e3}{' '}
                {cfHertzSelection === 'cfGhz' ? 'GHz' : cfHertzSelection === 'cfMhz' ? 'MHz' : 'KHz'}
              </span>
            </div>
            <RuxButton
              secondary
              size='small'
              iconOnly
              icon={sewAppCtx.sewApp[`specA${whichSpecA}`]?.isPause ? 'play-arrow' : 'pause'}
              onClick={() => handlePauseClicked()}
            />
          </Grid>
        </Grid>
        <div slot='footer'>
          <div style={{ display: 'flex', alignItems: 'flex-start', fontSize: 'var(--font-body-2-font-size)' }}>
            <RuxPopUp className='config-popup' placement='bottom-start' ref={el}>
              <div slot='trigger'>
                <RuxButton
                  className='trigger-icon'
                  iconOnly
                  size='small'
                  borderless
                  icon='settings'
                  onClick={() => {
                    setCurrentSpecAnalyzer(sewAppCtx.sewApp[`specA${whichSpecA}`]);
                  }}></RuxButton>
              </div>
              {dataAvailable ? (
                <div style={{ padding: 'var(--spacing-4)' }}>
                  <div
                    style={{
                      display: 'flex',
                      borderBottom: '1px solid var(--menu-divider-color-fill)',
                      paddingBottom: 'var(--spacing-4)',
                    }}>
                    <RuxRadioGroup
                      className='config-radio-group'
                      style={{ paddingRight: 'var(--spacing-8)' }}
                      name='Antennas'
                      label='Antenna'
                      ref={antenna}>
                      <RuxRadio value='1' name='Antennas'>
                        Antenna 1
                      </RuxRadio>
                      <RuxRadio value='2' name='Antennas'>
                        Antenna 2
                      </RuxRadio>
                    </RuxRadioGroup>
                    <RuxRadioGroup
                      className='config-radio-group'
                      style={{ paddingRight: 'var(--spacing-8)' }}
                      name='Frequency'
                      label='Frequency'
                      ref={radio}
                      onRuxchange={(e) => {
                        handleRadioFrequency(e)
                      }}
                      >
                      <RuxRadio value='Intermediate' name='Frequency'>
                        Intermediate
                      </RuxRadio>
                      <RuxRadio value='Radio' name='Frequency'>
                        Radio
                      </RuxRadio>
                    </RuxRadioGroup>
                    <RuxCheckboxGroup className='config-checkbox-group' name='viewOptions' label='View Options'>
                      <RuxCheckbox value='trace' name='viewOptions' checked={isTraceOn} ref={trace}>
                        Trace
                      </RuxCheckbox>
                      <RuxCheckbox value='marker' name='viewOptions' checked={isMarkerOn} ref={marker}>
                        Marker
                      </RuxCheckbox>
                    </RuxCheckboxGroup>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      paddingTop: 'var(--spacing-4)',
                      paddingBottom: 'var(--spacing-4)',
                      width: 'fit-content',
                      margin: 'auto',
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <RuxInput
                        className='config-input'
                        size='small'
                        label='Span'
                        id='span-id'
                        ref={spanInput}
                        value={
                          spanHertzSelection === 'spanMhz'
                            ? spanMhz
                            : spanHertzSelection === 'spanGhz'
                            ? spanGhz
                            : spanKhz
                        }
                        onRuxchange={(e) => {
                          handleInputSpanChange(e.target.value);
                        }}
                      />
                      <RuxSelect
                        size='small'
                        name='span-select'
                        inputId='span-id'
                        value={spanHertzSelection}
                        ref={spanSelect}
                        onRuxchange={(e) => {
                          setspanHertzSelection(e.target.value);
                        }}>
                        <RuxOption value='spanMhz' label='MHz'>
                          MHz
                        </RuxOption>
                        <RuxOption value='spanGhz' label='GHz'>
                          GHz
                        </RuxOption>
                        <RuxOption value='spanKhz' label='KHz'>
                          KHz
                        </RuxOption>
                      </RuxSelect>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 'var(--spacing-2)',
                      }}>
                      <RuxInput
                        className='config-input'
                        size='small'
                        label='Center Frequency'
                        id='frequency-id'
                        ref={cfInput}
                        value={cfHertzSelection === 'cfMhz' ? cfMhz : cfHertzSelection === 'cfGhz' ? cfGhz : cfKhz}
                        onRuxchange={(e) => {
                          handleInputFreqChange(e.target.value);
                        }}
                      />
                      <RuxSelect
                        size='small'
                        name='frequency-select'
                        inputId='frequency-id'
                        value={cfHertzSelection}
                        ref={cfSelect}
                        onRuxchange={(e) => {
                          setcfHertzSelection(e.target.value);
                        }}>
                        <RuxOption value='cfMhz' label='MHz'>
                          MHz
                        </RuxOption>
                        <RuxOption value='cfGhz' label='GHz'>
                          GHz
                        </RuxOption>
                        <RuxOption value='cfKhz' label='KHz'>
                          KHz
                        </RuxOption>
                      </RuxSelect>
                    </div>
                  </div>
                  <div
                    style={{ borderTop: '1px solid var(--menu-divider-color-fill)', paddingTop: 'var(--spacing-4)' }}>
                    <RuxButtonGroup hAlign='right'>
                      <RuxButton 
                        size='small' 
                        secondary
                        onClick={() => {
                          handleResetClick()
                        }}
                        >
                        Reset
                      </RuxButton>
                      <RuxButton
                        size='small'
                        onClick={() => {
                          handleApplyClick();
                          el.current.hide()
                        }}>
                        Apply
                      </RuxButton>
                    </RuxButtonGroup>
                  </div>

                  {/* <AnalyzerControl currentSpecAnalyzer={currentSpecAnalyzer} /> */}
                </div>
              ) : null}
            </RuxPopUp>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingTop: 'var(--spacing-1)', }}>
              <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)' }}>
                Antenna {currentAntennaInAnalyzer}
              </span>
              <span style={{ color: 'var(--color-text-placeholder)' }}>|</span>
              <span style={{ paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)' }}>
                {isRfMode ? 'Radio' : 'Intermediate'}
              </span>
              <span style={{ color: 'var(--color-text-placeholder)' }}>|</span>
              <span
                style={
                  isTraceOn
                    ? { paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)' }
                    : {
                        color: 'var(--color-text-placeholder)',
                        paddingRight: 'var(--spacing-2)',
                        paddingLeft: 'var(--spacing-2)',
                      }
                }>
                {isTraceOn ? 'Show Traces' : 'Hide Traces'}
              </span>
              <span style={{ color: 'var(--color-text-placeholder)' }}>|</span>
              <span
                style={
                  isMarkerOn
                    ? { paddingRight: 'var(--spacing-2)', paddingLeft: 'var(--spacing-2)' }
                    : {
                        color: 'var(--color-text-placeholder)',
                        paddingRight: 'var(--spacing-2)',
                        paddingLeft: 'var(--spacing-2)',
                      }
                }>
                {isMarkerOn ? 'Show Markers' : 'Hide Markers'}
              </span>
            </div>
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
