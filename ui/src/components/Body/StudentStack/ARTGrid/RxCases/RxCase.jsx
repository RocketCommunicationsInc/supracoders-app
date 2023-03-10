import React, { useState, useEffect } from 'react';
import { RuxTabPanels, RuxTabPanel, RuxTooltip, RuxIcon } from '@astrouxds/react'
import { RxModemButtonBox } from '../RxCases/RxModem/RxModemButtonBox';
import { RxModem } from '../../../..';
import { EquipmentCase } from '../EquipmentCase';
import { useSewApp } from './../../../../../context/sewAppContext';
import { PropTypes } from 'prop-types';


export const RxCase = ({ unit }) => {
  const sewAppCtx = useSewApp();
  const [activeModem, setActiveModem] = useState(1);
  const [currentRow, setCurrentRow] = useState(1);
  const unitData = sewAppCtx.rx.filter(
    (x) => x.unit == unit && x.team_id == sewAppCtx.user.team_id && x.server_id == sewAppCtx.user.server_id
  );

  const determineEquipmentStatus = (unit) => {
    const currentModems = sewAppCtx.rx.filter(
      (rx) =>
        rx.unit === (unit - 1) * 4 + 1 ||
        rx.unit === (unit - 1) * 4 + 2 ||
        rx.unit === (unit - 1) * 4 + 3 ||
        rx.unit === (unit - 1) * 4 + 4
    );
    const isFound = currentModems.filter((rx) => rx.found).length > 0;
    const isDegraded = currentModems.filter((rx) => rx.degraded).length > 0;
    const isDenied = currentModems.filter((rx) => rx.denied).length > 0;

    let color = '';
    let description = '';
    if (isFound && !isDegraded && !isDenied) {
      color = 'var(--color-status-normal)';
      description = 'Signal Found';
    } else if (isFound && isDegraded && !isDenied) {
      color = 'var(--color-status-caution)';
      description = 'Signal Degraded';
    } else if (isFound && isDenied) {
      color = 'var(--color-status-critical)';
      description = 'Signal Denied';
    } else {
      color = 'var(--color-status-off)';
      description = 'Signal Not Found';
    }
    return {
      color,
      description,
    };
  };

  const updateActiveModem = (modem) => {
    setActiveModem(modem);
  };

  useEffect(() => {
    const currentModem = unitData.find((x) => x.modem_number == activeModem);
    const _currentRow = sewAppCtx.rx.findIndex((x) => x.id == currentModem.id);
    setCurrentRow(_currentRow);
  }, [activeModem]);


  const { color, description } = determineEquipmentStatus(unit);
  return (
      <EquipmentCase
        title='Receiver Case'
        unit={unit}
        icon={
          <RuxTooltip message={description}>
            <RuxIcon icon="signal-cellular-alt" size="1.75rem"
              style={{ color: color, paddingLeft: 'var(--spacing-3)'}}
            />
          </RuxTooltip>
        }
        tabs={
          <RxModemButtonBox
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
                    {/* <RxModem unit={unit} /> */}
                    <RxModem
                     unitData={unitData} activeModem={activeModem} currentRow={currentRow} />
                  </RuxTabPanel>
                  );
                }
              })}
            
          </RuxTabPanels>
      </EquipmentCase>
  );
};
RxCase.propTypes = {
  unit: PropTypes.number.isRequired,
};
