import React from 'react';
import { RuxProgress, RuxIndeterminateProgress } from '@astrouxds/react'
import { Box} from '@mui/material';
import { PropTypes } from 'prop-types';

export const LinearProgressWithLabel = props => {
  const MED = 75;
  const HIGH = 90;
  //const [rawPw, setrawPw] = useState(Math.round(props.value))
  let rawPw = Math.round(props.value);
  //const [pw, setpw] = useState(Math.min(100, rawPw))
  let pw = Math.min(100, rawPw);

  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: rawPw < 100 ? '100%' : 'auto', mr: 1, ml: 1 }}>
        {pw < MED ? <RuxProgress value={pw} hideLabel /> : null}
        {pw >= MED && pw < HIGH ? <RuxProgress value={pw} color={'error'} hideLabel /> : null}
        {pw >= HIGH ? (
          rawPw > 100 
          ? <RuxIndeterminateProgress
            {...props}
            value={pw}
            color={'critical'}
          ></RuxIndeterminateProgress> 
          : <RuxProgress
            {...props}
            value={pw}
            color={'critical'}
          ></RuxProgress>
        ) : null}
      </Box>
    </Box>
  );
};
LinearProgressWithLabel.propTypes = {
  ...LinearProgressWithLabel.propTypes,
  value: PropTypes.number.isRequired,
};
