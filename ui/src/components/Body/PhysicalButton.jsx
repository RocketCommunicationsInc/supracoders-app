import React from 'react';
import { Button } from '@mui/material';
import { PropTypes } from 'prop-types';
import { AstroTheme } from '../../themes/AstroTheme';
import './3d-buttons.css';

export const PhysicalButton = ({ isEnabled, color, onClick, text }) => {
  let sxFront = {};
  let sxEdge = {};
  switch (color) {
    case 'red':
      sxFront = {
        background: isEnabled ? AstroTheme.palette.critical.main : AstroTheme.system.colors.backgroundInteractiveDefault,
        color: '#fff',
      };
      sxEdge = {
        background: isEnabled
        ? `linear-gradient(to left, ${AstroTheme.reference.color.palette.red[700]} 0%, ${AstroTheme.reference.color.palette.red[800]} 8%, ${AstroTheme.reference.color.palette.red[800]} 92%, ${AstroTheme.reference.color.palette.red[700]} 100%)`
        : `linear-gradient(to left, ${AstroTheme.system.colors.backgroundInteractiveMuted} 0%, ${AstroTheme.reference.color.palette.darkblue[700]} 8%, ${AstroTheme.reference.color.palette.darkblue[700]} 92%, ${AstroTheme.system.colors.backgroundInteractiveMuted} 100%)`,
      };
      break;
    case 'green':
    default:
      sxFront = {
        background: isEnabled ? AstroTheme.palette.success.main : AstroTheme.system.colors.backgroundInteractiveDefault,
        color: isEnabled ? '#000' : '#fff',
      };
      sxEdge = {
        background: isEnabled
          ? `linear-gradient(to left, ${AstroTheme.reference.color.palette.green[700]} 0%, ${AstroTheme.reference.color.palette.green[800]} 8%, ${AstroTheme.reference.color.palette.green[800]} 92%, ${AstroTheme.reference.color.palette.green[700]} 100%)`
          : `linear-gradient(to left, ${AstroTheme.system.colors.backgroundInteractiveMuted} 0%, ${AstroTheme.reference.color.palette.darkblue[700]} 8%, ${AstroTheme.reference.color.palette.darkblue[700]} 92%, ${AstroTheme.system.colors.backgroundInteractiveMuted} 100%)`,
      };
      break;
  }

  return (
    <Button className='pushable' onClick={onClick}>
      <span className='shadow'></span>
      <span className='edge' style={sxEdge}></span>
      <span className='front' style={sxFront}>
        {text}
      </span>
    </Button>
  );
};

PhysicalButton.propTypes = {
  isEnabled: PropTypes.bool,
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
