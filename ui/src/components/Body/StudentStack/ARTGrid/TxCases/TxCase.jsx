import React, { Fragment, useEffect, useState } from 'react';
import { RuxTooltip, RuxTabPanel, RuxTabPanels } from '@astrouxds/react'
import { TxModemButtonBox } from '../TxCases/TxModem/TxModemButtonBox';
import { TxModem } from '../../../..';
import { EquipmentCase } from '../EquipmentCase';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import { useSewApp } from '../../../../../context/sewAppContext';
import { PropTypes } from 'prop-types';
import TxCaseHelp from './../../HelpModals/TxCaseHelp';

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
        helpTitle='Transmit Modem Help'
        helpComponent={TxCaseHelp}
        unit={unit}
        icon={
          <RuxTooltip message={isTransmitting ? 'Transmitting' : 'Not Transmitting'}>
            <PodcastsIcon
              sx={{ color: isTransmitting ? 'var(--color-status-normal)' : 'var(--color-status-off)' }}
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
            <RuxTabPanel ariaLabelledby={`modem-${unit}`}><TxModem unitData={unitData} activeModem={activeModem} currentRow={currentRow} /></RuxTabPanel>
          </RuxTabPanels>
      </EquipmentCase>
    </Fragment>
  );
};
TxCase.propTypes = {
  unit: PropTypes.number.isRequired,
  isTransmitting: PropTypes.bool,
};
