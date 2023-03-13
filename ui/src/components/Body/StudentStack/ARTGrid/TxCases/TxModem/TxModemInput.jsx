import React, { useState, useEffect } from 'react';
import { RuxButton, RuxPushButton, RuxSelect, RuxOption, RuxInput, RuxProgress } from '@astrouxds/react'
import { Box, Grid, Typography, Card } from '@mui/material';
import { useSewApp } from '../../../../../../context/sewAppContext';
import { CRUDdataTable } from '../../../../../../crud';
import { sxModalError, outputStyle } from '../../../../../styles';
import { breakerSound, errorSound, selectSound } from '../../../../../../audio';
import { useSound } from 'use-sound';
import { PropTypes } from 'prop-types';
// import { LinearProgressWithLabel } from './LinearProgressWithLabel';

const popupTimeoutTime = 3000;
let errorResetTimeout;

export const TxModemInput = ({ unitData, activeModem, currentRow, }) => {
  const [playSelectSound] = useSound(selectSound);
  const [playBreakerSound] = useSound(breakerSound);
  const [playErrorSound] = useSound(errorSound);
  const sewAppCtx = useSewApp();
  const powerBudget = 23886; // Decided by SEW team
  const [isErrorActive, setErrorActive] = useState(false);
  const [inputData, setInputData] = useState(sewAppCtx.tx[currentRow]);
  const [modemPower, setModemPower] = useState(inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10));
  const [rawPower, setRawPower] = useState(Math.round((100 * (inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10))) / powerBudget));
  const MED = 75;
  const HIGH = 90;


  useEffect(() => {
    const newInputData = sewAppCtx.tx[currentRow];
    setInputData(newInputData);
    setModemPower(newInputData.bandwidth * Math.pow(10, (120 + newInputData.power) / 10));
    setRawPower(Math.round((100 * (newInputData.bandwidth * Math.pow(10, (120 + newInputData.power) / 10))) / powerBudget))
  }, [currentRow]);

  const handleInputChange = ({ param, val }) => {
    if (param === 'power') {
      // if contains any symbols except - and number then return
      if (val.match(/[^0-9-]/g)) return;
      if (!isNaN(parseInt(val))) {
        val = parseInt(val);
      }
    }
    let tmpData = { ...sewAppCtx.tx[currentRow] };
    tmpData[param] = val;
    setInputData(tmpData);
  };

  const validatePowerConsumption = (_modemPower = modemPower) => Math.round((100 * _modemPower) / powerBudget) <= 100;

  const handleApply = () => {
    playSelectSound();
    let tmpData = [...sewAppCtx.tx];
    tmpData[currentRow] = { ...inputData };
    const newModemPower = inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10)
    const newRawPower =  Math.round((100 * newModemPower) / powerBudget)

    if (
      validatePowerConsumption(newModemPower) ||
      !tmpData[currentRow].transmitting
    ) {
      sewAppCtx.updateTx(tmpData);
      setModemPower(newModemPower);
      setRawPower(newRawPower)
      console.log(newModemPower)
      CRUDdataTable({ method: 'PATCH', path: 'transmitter', data: tmpData[currentRow] });
    } else {
      setErrorActive(true);
      playErrorSound();
      if (errorResetTimeout) clearTimeout(errorResetTimeout);
      errorResetTimeout = setTimeout(() => {
        setErrorActive(false);
      }, popupTimeoutTime);
    }
  };

  const handleTransmit = () => {
    playBreakerSound();
    let tmpData = [...sewAppCtx.tx];

    if (validatePowerConsumption()) {
      tmpData[currentRow].transmitting = !tmpData[currentRow].transmitting;
      sewAppCtx.updateTx(tmpData);
      // console.log('CRUD Tx: ', tmpData[currentRow]);
      CRUDdataTable({ method: 'PATCH', path: 'transmitter', data: tmpData[currentRow] });
    } else {
      setErrorActive(true);
      playErrorSound();
      if (errorResetTimeout) clearTimeout(errorResetTimeout);
      errorResetTimeout = setTimeout(() => {
        setErrorActive(false);
      }, popupTimeoutTime);
    }
  };

  return (
    <>
      {isErrorActive ? (
        <Box sx={sxModalError}>
          <Typography>Power consumption exceeds the budget.</Typography>
        </Box>
      ) : null}
      <Grid container height={'100%'}>
        <Grid container item xs={12} spacing={0.5}>
          <Grid container item xs={12} pt={0} alignItems='center' justify='center'>
            <Grid item xs={8} pl={2} pr={2}>
              <RuxSelect
                name='Antenna'
                label='Antenna'
                size='small'
                value={inputData.antenna_id}
                onRuxchange={(e) =>
                  handleInputChange({
                    param: 'antenna_id',
                    val: parseInt(e.target.value) || 0,
                  })
                }
              >
                <RuxOption value={1} label={1}>1</RuxOption>
                <RuxOption value={2} label={2}>2</RuxOption>
              </RuxSelect>
            </Grid>
            <Grid item xs={true}>
              <Card
                variant='outlined'
                sx={outputStyle}
                >
                  {sewAppCtx.tx[currentRow].antenna_id}
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems='center' justify='center'>
            <Grid item xs={8} pl={2} pr={2}>
              <RuxInput
                name='frequency'
                type='text'
                label='Freq'
                size='small'
                value={inputData.frequency}
                onRuxchange={(e) =>
                  handleInputChange({
                    param: 'frequency',
                    val: parseInt(e.target.value) || 0,
                  })
                }
              >

              </RuxInput>
            </Grid>
            <Grid item xs={true}>
              <Card
                variant='outlined'
                sx={outputStyle}
                >
                  {sewAppCtx.tx[currentRow].frequency + ' MHz'}
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems='center' justify='center'>
            <Grid item xs={8} pl={2} pr={2}>
              <RuxInput
                name='bandwidth'
                type='text'
                size='small'
                label='BW'
                value={inputData.bandwidth}
                onRuxchange={(e) =>
                  handleInputChange({
                    param: 'bandwidth',
                    val: parseInt(e.target.value) || 0,
                  })
                }
              >
              </RuxInput>
            </Grid>
            <Grid item xs={true}>
              <Card
                variant='outlined'
                sx={outputStyle}
                >
                  {sewAppCtx.tx[currentRow].bandwidth + ' MHz'}
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems='center' justify='center'>
            <Grid item xs={8} pl={2} pr={2}>
              <RuxInput
                name='power'
                type='string'
                size='small'
                label='Power'
                value={inputData.power}
                onRuxchange={(e) => handleInputChange({ param: 'power', val: e.target.value })}
              >
              </RuxInput>
            </Grid>
            <Grid item xs={true}>
              <Card
                variant='outlined'
                sx={outputStyle}
                >
                  {`${sewAppCtx.tx[currentRow].power} dBm`}
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems='center' justify='center'>
            <Grid item xs={true} sx={{ display: 'flex', paddingTop: 'var(--spacing-2)' }}>
              <span style={{ marginRight: 'var(--spacing-2)', minWidth: 'calc(var(--spacing-16) + var(--spacing-2))', marginBottom: 'var(--spacing-0)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>Power %</span>
              <RuxProgress value={Math.min(100, rawPower)} style={{ width: '100%' }}  />
              {/* <LinearProgressWithLabel value={Math.round((100 * modemPower) / powerBudget)} /> */}
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems='center' justify='center'>
            <Grid item xs={true}>
              {Math.min(100, rawPower) >= MED && Math.min(100, rawPower) < HIGH && <p className='progress-error' style={{ color: 'var(--color-text-error)', fontWeight: '700', marginBottom: '0', marginLeft: 'calc(var(--spacing-16) + var(--spacing-2))' }}>*Power warning</p>}
              {Math.min(100, rawPower) >= HIGH && (
                rawPower > 100 
                ? <p className='progress-error' style={{ color: 'var(--color-text-error)', fontWeight: '700', marginBottom: '0', marginLeft: 'calc(var(--spacing-16) + var(--spacing-2))' }}>*Power exceeded</p>
                : <p className='progress-error' style={{ color: 'var(--color-text-error)', fontWeight: '700', marginBottom: '0', marginLeft: 'calc(var(--spacing-16) + var(--spacing-2))' }}>*Power critical</p>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          mt={1}
          textAlign='right'
          alignItems={'flex-end'}
          justifyContent={'flex-end'}
          flexGrow={true}
          display={'flex'}>
          <RuxPushButton label={!unitData.filter((x) => x.modem_number == activeModem)[0].transmitting ? 'Enable' : 'Disable' } onRuxchange={(e) => handleTransmit(e)} checked={
            unitData.filter((x) => x.modem_number == activeModem)[0].transmitting ? true : false}/>
          <RuxButton style={{ marginLeft: '8px' }} onClick={(e) => handleApply(e)}>
            Apply
          </RuxButton>
        </Grid>
      </Grid>
    </>
  );
};

TxModemInput.propTypes = {
  unitData: PropTypes.array.isRequired,
  activeModem: PropTypes.number.isRequired,
  currentRow: PropTypes.number.isRequired,
};
