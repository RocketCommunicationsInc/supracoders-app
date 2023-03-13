import React from 'react';
import { RuxTabs } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { TxModemButton } from './TxModemButton';

export const TxModemButtonBox = ({ unitData, unit, activeModem, updateActiveModem }) => {
  return (
    <RuxTabs small id={`tx-modem-case-${unit}`}>
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
    </RuxTabs>
  );
};
TxModemButtonBox.propTypes = {
  unitData: PropTypes.array.isRequired,
  unit: PropTypes.number.isRequired,
  activeModem: PropTypes.number.isRequired,
  updateActiveModem: PropTypes.func.isRequired,
};
