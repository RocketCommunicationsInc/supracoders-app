import React from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ServerSelect } from './ServerSelect';
import { TeamSelect } from './TeamSelect';
import { JoinButton } from './JoinButton';
import { AstroTheme } from '../../themes/AstroTheme';

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/student', { state: { isAuthenticated: true } });
  };

  return (
    <>
      <Box
        component='form'
        onSubmit={handleSubmit}
        bgcolor={AstroTheme.system.colors.backgroundSurfaceDefault}
        color={AstroTheme.typography.colors.primary}
        sx={{
          margin: 'auto',
          borderRadius: AstroTheme.reference.radii.radiusBase,
          '& > :not(style)': { m: 1 },
        }}
        novalidate
        autocomplete='off'>
        <Grid container spacing={1} p={2} width={300}>
          <TeamSelect />
          <ServerSelect />
          <JoinButton />
        </Grid>
      </Box>
    </>
  );
};

export default Login;
