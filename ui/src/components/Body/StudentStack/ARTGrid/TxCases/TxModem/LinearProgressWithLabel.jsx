import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { AstroTheme } from '../../../../../../themes/AstroTheme';

export const LinearProgressWithLabel = props => {
  const MED = 75;
  const HIGH = 90;
  const rawPw = Math.round(props.value);
  const pw = Math.min(100, rawPw);

  const sxLinearId = {
    backgroundColor: 'transparent',
    boxShadow: `0 0 0 1px ${AstroTheme.system.colors.backgroundInteractiveDefault}`,
    border: `1px solid ${AstroTheme.system.colors.backgroundBaseDefault}`,
    borderRadius: AstroTheme.component.progress.borderRadius,
    height: `var(--spacing-3)`,
    '& .MuiLinearProgress-bar': {
      backgroundColor: AstroTheme.system.colors.backgroundInteractiveDefault,
    }
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1, ml: 1 }}>
        {pw < MED ? <LinearProgress variant='determinate' {...props} value={pw} sx={sxLinearId} /> : null}
        {pw >= MED && pw < HIGH ? <LinearProgress variant='determinate' {...props} value={pw} sx={sxLinearId}/> : null}
        {pw >= HIGH ? (
          <LinearProgress
            variant={rawPw > 100 ? 'indeterminate' : 'determinate'}
            {...props}
            value={pw}
            color={'critical'}
            sx={sxLinearId}
          />
        ) : null}
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color={AstroTheme.typography.colors.primary}>
          {`${rawPw}%`}
        </Typography>
      </Box>
    </Box>
  );
};
LinearProgressWithLabel.propTypes = {
  ...LinearProgressWithLabel.propTypes,
  value: PropTypes.number.isRequired,
};
