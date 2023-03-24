/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './TxModem.css';
import { TxModemInput } from './TxModemInput';

export const TxModem = ({ unitData, activeModem, currentRow }) => {

  return (
    <Grid container>
      <Grid item xs={'auto'}>
      </Grid>
      <Grid item xs={true}>
        <TxModemInput unitData={unitData} activeModem={activeModem} currentRow={currentRow} />
      </Grid>
    </Grid>
  );
};

TxModem.propTypes = {
  unit: PropTypes.number,
};
