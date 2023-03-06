import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import PropTypes from 'prop-types';
// import { Box } from '@mui/material';
import { TxModemButton } from './TxModemButton';
// import { sxModemButtonBox } from '../../../../../styles/sxModemButtonBox';

export const TxModemButtonBox = ({ unitData, unit, activeModem, updateActiveModem }) => {
  return (
    <RuxContainer className="modemButtonBox">
      {unitData
        .sort((a, b) => a.id - b.id)
        .map((x, index) => {
          if (x.unit == unit) {
            return (
              <TxModemButton
                key={index}
                modemId={x.modem_number}
                isTransmitting={x.transmitting}
                isActive={x.modem_number === activeModem}
                updateActiveModem={updateActiveModem}
              />
            );
          }
        })}
    </RuxContainer>
  );
};
TxModemButtonBox.propTypes = {
  unitData: PropTypes.array.isRequired,
  unit: PropTypes.number.isRequired,
  activeModem: PropTypes.number.isRequired,
  updateActiveModem: PropTypes.func.isRequired,
};
