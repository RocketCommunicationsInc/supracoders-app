import React from 'react';
import { RuxContainer } from '@astrouxds/react'
//import Box from '@mui/material/Box';
//import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ServerSelect } from './ServerSelect';
import { TeamSelect } from './TeamSelect';
import { JoinButton } from './JoinButton';
import "./login.css";

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/student', { state: { isAuthenticated: true } });
  };

  return (
      <RuxContainer className="login-container">
          <div slot='header'>Join a team</div>
          <form
            component='form'
            onSubmit={handleSubmit}
            noValidate
            autoComplete='off'>
              <TeamSelect />
              <ServerSelect />
              <JoinButton />
          </form>
      </RuxContainer>
  );
};

export default Login;
