import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mui/material';
import { AstroTheme } from '../../../../../../themes/AstroTheme';
import { selectSound } from '../../../../../../audio';
import { useSound } from 'use-sound';

const sxTxModemButton = (params) => {
  const { isTransmitting, isActive } = params;
  return {
    backgroundColor: isActive ? AstroTheme.reference.color.palette.green[500] : "none",
    border: isActive ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveDefault,
    color: isActive ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveDefault,
    outline: isTransmitting && 'var(--border-width-focus-default) solid var(--color-border-focus-default)',
    outlineOffset: isTransmitting && 'var(--spacing-focus-default)',
    borderRadius: 'var(--radius-base)',
    width: '5px',
    margin: '8px',
    '&:hover': {
      backgroundColor: isActive ? AstroTheme.reference.color.palette.green[400] : "none",
      border: isActive ? '1px solid ' + AstroTheme.reference.color.palette.green[400] : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveHover,
      color: isActive ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
    },
  };
};

export const TxModemButton = ({ modemId, isTransmitting, isActive, updateActiveModem }) => {
  const [playSelectSound] = useSound(selectSound);
  return (
    <Tooltip title={'Transmit Modem ' + modemId.toString()}>
      <Button
        sx={sxTxModemButton({ isTransmitting, isActive })}
        onClick={() => {
          playSelectSound();
          updateActiveModem(modemId);
        }}>
        {modemId}
      </Button>
    </Tooltip>
  );
};

TxModemButton.propTypes = {
  modemId: PropTypes.number.isRequired,
  isTransmitting: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  updateActiveModem: PropTypes.func.isRequired,
};
