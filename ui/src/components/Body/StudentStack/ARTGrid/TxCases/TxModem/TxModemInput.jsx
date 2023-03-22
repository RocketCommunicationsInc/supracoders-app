import React, { useState, useEffect } from 'react';
import { RuxButton, RuxSelect, RuxOption, RuxInput } from '@astrouxds/react'
import { Grid, Card } from '@mui/material';
import { useSewApp } from '../../../../../../context/sewAppContext';
import { CRUDdataTable } from '../../../../../../crud';
import { outputStyle } from '../../../../../styles';
import { breakerSound, errorSound, selectSound } from '../../../../../../audio';
import { PowerMonitor } from './PowerMonitor';
import { useSound } from 'use-sound';
import { PropTypes } from 'prop-types';

export const TxModemInput = ({ unitData, activeModem, currentRow, }) => {
  const [playSelectSound] = useSound(selectSound);
  const [playBreakerSound] = useSound(breakerSound);
  const [playErrorSound] = useSound(errorSound);
  const sewAppCtx = useSewApp();
  const { updateNotification } = sewAppCtx
  const powerBudget = 23886; // Decided by SEW team
  const [inputData, setInputData] = useState(sewAppCtx.tx[currentRow]);
  const [modemPower, setModemPower] = useState(inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10));
  const [rawPower, setRawPower] = useState(Math.round((100 * (inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10))) / powerBudget));


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
    let tmpData = { ...inputData };
    tmpData[param] = val;
    setInputData(tmpData);
  };

  const validatePowerConsumption = (_modemPower = modemPower) => Math.round((100 * _modemPower) / powerBudget) <= 100;

  const handleApply = () => {
    playSelectSound();
    let tmpData = [...sewAppCtx.tx];
    tmpData[currentRow] = { ...inputData, transmitting: sewAppCtx.tx[currentRow].transmitting };
    const newModemPower = inputData.bandwidth * Math.pow(10, (120 + inputData.power) / 10)
    const newRawPower =  Math.round((100 * newModemPower) / powerBudget)

    if (
      validatePowerConsumption(newModemPower) ||  !tmpData[currentRow].transmitting
    ) {
      sewAppCtx.updateTx(tmpData);
      setModemPower(newModemPower);
      setRawPower(newRawPower)
      CRUDdataTable({ method: 'PATCH', path: 'transmitter', data: tmpData[currentRow] });
    } else {
      playErrorSound();
      updateNotification(true, 'serious', 'Power consumption exceeds the budget', 5000)
    }
  };

  const handleTransmit = () => {
    playBreakerSound();
    let tmpData = [...sewAppCtx.tx];

    if (validatePowerConsumption()) {
      tmpData[currentRow].transmitting = !tmpData[currentRow].transmitting;
      sewAppCtx.updateTx(tmpData);
      updateNotification(false, 'off', 'no notifications', 5000)
      CRUDdataTable({ method: 'PATCH', path: 'transmitter', data: tmpData[currentRow] });
    } else {
      playErrorSound();
      updateNotification(true, 'serious', 'Power consumption exceeds the budget', 5000)
    }
  };

  return (
    <>
      <Grid container height={'100%'}>
        <Grid item xs={5} sx={{ display: 'flex' }}>
          <PowerMonitor rawPower={rawPower} />
        </Grid>
        <Grid container item xs={7} spacing={0.5} style={{maxHeight: '190px'}}>
          <Grid container item xs={12} pt={0} alignItems='center' justify='center'>
            <Grid item xs={8} pl={2} pr={1}>
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
            <Grid item xs={8} pl={2} pr={1}>
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
            <Grid item xs={8} pl={2} pr={1}>
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
            <Grid item xs={8} pl={2} pr={1}>
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
            <RuxButton secondary onClick={(e) => handleApply(e)}>
              Apply Changes
            </RuxButton>
            <RuxButton className="enable-btn" style={{ marginLeft: '8px', minWidth: '150px' }} onClick={(e) => handleTransmit(e)}>{!unitData.filter((x) => x.modem_number == activeModem)[0].transmitting ? 'Enable modem' : 'Disable modem' }</RuxButton>
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
