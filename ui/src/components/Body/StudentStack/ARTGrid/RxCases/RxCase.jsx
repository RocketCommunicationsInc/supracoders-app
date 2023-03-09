import React from 'react';
import { RuxTooltip } from '@astrouxds/react'
import { RxModem } from '../../../..';
import { EquipmentCase } from '../EquipmentCase';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useSewApp } from './../../../../../context/sewAppContext';
import { PropTypes } from 'prop-types';
import RxCaseHelp from '../../HelpModals/RxCaseHelp';

export const RxCase = ({ unit }) => {
  const sewAppCtx = useSewApp();

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

  const { color, description } = determineEquipmentStatus(unit);
  return (
      <EquipmentCase
        title='Receiver Case'
        helpTitle='Reciever Modem Help'
        helpComponent={RxCaseHelp}
        unit={unit}
        icon={
          <RuxTooltip message={description}>
            <SignalCellularAltIcon sx={{ color: color }} />
          </RuxTooltip>
        }>
        <RxModem unit={unit} />
      </EquipmentCase>
  );
};
RxCase.propTypes = {
  unit: PropTypes.number.isRequired,
};
