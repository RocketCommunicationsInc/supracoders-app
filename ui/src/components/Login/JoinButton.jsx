import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { AstroTheme } from '../../themes/AstroTheme';

const sxButton = {
  backgroundColor: AstroTheme.system.colors.backgroundInteractiveDefault,
  //boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
  color: AstroTheme.typography.colors.inverse,
  cursor: 'pointer',
  textTransform: 'Capitalize',
  '&:hover': {
    backgroundColor: AstroTheme.system.colors.backgroundInteractiveHover,
  }
};

export const JoinButton = () => (
  <Grid item xs={12} textAlign={'center'} mt={3}>
    <Button type='submit' size='large' sx={sxButton}>
      <Typography sx={{ fontFamily: 'Nasa' }}>
        Join
      </Typography>
    </Button>
  </Grid>
);
