import React, { useEffect } from 'react';
import { ARTGrid, SpectrumAnalyzerGrid} from '../../';
// import { Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSewApp } from '../../../context/sewAppContext';
import { NotificationBanner } from './NotificationBanner';

export const StudentStack = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sewAppCtx = useSewApp();

  useEffect(() => {
    window.sewApp.init();
    sewAppCtx.updateSewApp();
  }, []);

  // Basic check that user is logged in
  useEffect(() => {
    if (!state || state?.isAuthenticated !== true) navigate('/login');
  }, [state, navigate]);

  return (
    <>
      <NotificationBanner />
        <SpectrumAnalyzerGrid />
        <ARTGrid />
    </>
  );
};
