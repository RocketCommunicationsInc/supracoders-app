import React from 'react';
import { Grid } from '@mui/material';
import { RxCases, TxCases, Antenna } from '../../../';

export const ARTGrid = () => (
  <>
  <div className="art-grid">
    <Antenna />
    <div></div>
    <div></div>
  </div>
  
    <Grid container item spacing={2} xs={12}>
      
    </Grid>
    <Grid container item spacing={2} xs={12}>
      <TxCases />
    </Grid>
    <Grid container item spacing={2} xs={12}>
      <RxCases />
    </Grid>
  </>
);
