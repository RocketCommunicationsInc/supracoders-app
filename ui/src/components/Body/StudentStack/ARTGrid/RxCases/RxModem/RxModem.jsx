import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './RxModem.css';
// import { useSewApp } from '../../../../../../context/sewAppContext';
// import { RxModemButtonBox } from './RxModemButtonBox';
import { RxModemInput } from './RxModemInput';
import { RxVideo } from './RxVideo';

export const RxModem = ({ unitData, activeModem, currentRow }) => {

  return (
    <Grid container style={{height:'100%'}}>
      <Grid container item xs={true}>
        <Grid item xs={5}>
          <RxVideo currentRow={currentRow} />
        </Grid>
        <Grid item xs={7}>
          <RxModemInput unitData={unitData} activeModem={activeModem} currentRow={currentRow} />
        </Grid>
      </Grid>
    </Grid>
  );
};

RxModem.propTypes = {
  unit: PropTypes.number,
  unitData: PropTypes.array,
  activeModem: PropTypes.number,
  currentRow: PropTypes.number,
  tmpRxData: PropTypes.array,
};
