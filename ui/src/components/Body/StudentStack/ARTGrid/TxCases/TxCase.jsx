import React, { Fragment, useEffect, useState } from 'react';
import { RuxTooltip, RuxTabPanel, RuxTabPanels, RuxIcon } from '@astrouxds/react'
import { TxModemButtonBox } from '../TxCases/TxModem/TxModemButtonBox';
import { TxModem } from '../../../..';
import { EquipmentCase } from '../EquipmentCase';
import { useSewApp } from '../../../../../context/sewAppContext';
import { PropTypes } from 'prop-types';

export const TxCase = ({ unit }) => {
  const sewAppCtx = useSewApp();
  const isTransmitting =
    sewAppCtx.tx
      .filter(
        (tx) =>
          tx.id === (unit - 1) * 4 + 1 ||
          tx.id === (unit - 1) * 4 + 2 ||
          tx.id === (unit - 1) * 4 + 3 ||
          tx.id === (unit - 1) * 4 + 4
      )
      .filter((tx) => tx.transmitting).length > 0;
      console.log(sewAppCtx.tx)

      const [activeModem, setActiveModem] = useState(1);
      const [currentRow, setCurrentRow] = useState(1);
      const unitData = sewAppCtx.tx.filter(
        x => x.unit == unit && x.team_id == sewAppCtx.user.team_id && x.server_id == sewAppCtx.user.server_id
      );
    
      const updateActiveModem = modem => {
        setActiveModem(modem);
      };
    
      useEffect(() => {
        const currentModem = unitData.find(x => {
          return x.modem_number == activeModem;
        });
        const _currentRow = sewAppCtx.tx.findIndex(x => x.id == currentModem.id);
        setCurrentRow(_currentRow);
      }, [activeModem]);

  return (
    <Fragment key={unit}>
      <EquipmentCase
        title='Transmit Case'
        unit={unit}
        icon={
          <RuxTooltip message={isTransmitting ? 'Transmitting' : 'Not Transmitting'}>
            <RuxIcon icon="antenna" size="1.75rem"
              style={{ color: isTransmitting ? 'var(--color-status-normal)' : 'var(--color-status-off)', paddingLeft: 'var(--spacing-3)'}}
            />
          </RuxTooltip>
        }
        tabs={
          <TxModemButtonBox
            unitData={unitData}
            activeModem={activeModem}
            unit={unit}
            updateActiveModem={updateActiveModem}
          />
        }
        >
          <RuxTabPanels ariaLabelledby={`modem-case-${unit}`}>
            {unitData
              .sort((a, b) => a.id - b.id)
              .map((x, index) => {
                if (x.unit == unit) {
                  return (
                  <RuxTabPanel key={index} ariaLabelledby={`modem-${x.modem_number}`} style={{ display: 'flex' }}>
                    <h2 style={{ fontFamily: 'Nasa', minWidth: 'calc(var(--spacing-1) * 5)', textAlign: 'center'}}>{x.modem_number}</h2>
                    <TxModem
                     unitData={unitData} activeModem={activeModem} currentRow={currentRow} />
                  </RuxTabPanel>
                  );
                }
              })}
            
          </RuxTabPanels>
      </EquipmentCase>
    </Fragment>
  );
};
TxCase.propTypes = {
  unit: PropTypes.number.isRequired,
  isTransmitting: PropTypes.bool,
};
