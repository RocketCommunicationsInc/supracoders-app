import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { LoopbackSwitch } from './LoopbackSwitch';
import { AntennaInput } from './AntennaInput';

export const AntennaController = ({ unit }) => {
  return (
    <Grid container height={'100%'}>
      <Grid item xs={'auto'} m={'0 auto'}>
        <LoopbackSwitch unit={unit} />
      </Grid>
      <Grid item xs={true} m={'0 auto'} height={'100%'}>
        <AntennaInput unit={unit} />
      </Grid>
    </Grid>
  );
};

AntennaController.propTypes = {
  unit: PropTypes.number,
};
