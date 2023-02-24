/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import { Paper } from '@mui/material';
import React from 'react';
import { AstroTheme } from '../../themes/AstroTheme';
// Contains the main part of the app

export const Body = props => {
  const theme = AstroTheme;
  const sxBody = {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    height: '100%',
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.system.colors.backgroundBaseDefault,
  };
  return <Paper sx={sxBody}>{props.children}</Paper>;
};
