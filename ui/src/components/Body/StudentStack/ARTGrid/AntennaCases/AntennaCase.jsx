import React, { useState, useEffect } from 'react';
import { RuxTooltip, RuxIcon } from '@astrouxds/react'
import { AntennaController } from '../../../..';
import { EquipmentCase2 } from '../EquipmentCase2';
import  AntennaHelp from '../../HelpModals/AntennaHelp'
import { useSewApp } from '../../../../../context/sewAppContext';

export const AntennaCase = () => {
  const [modalState, setModalState] = useState(false);
  const [antColor, setAntColor] = useState('var(--color-status-standby)');
  const [antState, setAntState] = useState('standby');
  const [lockColor, setLockColor] = useState('var(--color-status-standby)');
  const [lockState, setLockState] = useState('standby');
  const [unit, setUnit] = useState(1)
  const sewAppCtx = useSewApp();
  //number of antenna units
  const units = [1,2]
  const icons = (            <>
    <RuxTooltip message={antState}>
      <RuxIcon icon="antenna" size="1.75rem"
        style={{ color: antColor, paddingLeft: 'var(--spacing-3)'}}
      />

    </RuxTooltip>
    <RuxTooltip message={lockState}>
      {lockState === 'Locked' ? <RuxIcon icon="lock" size="1.75rem" style={{ color: lockColor, paddingLeft: 'var(--spacing-3)'}}/> : 
       <RuxIcon icon="lock-open" size="1.75rem" style={{ color: lockColor, paddingLeft: 'var(--spacing-3)'}}/>
      }
    </RuxTooltip>
  </>)

  useEffect(() => {
    const antenna = sewAppCtx.antenna[unit - 1];
    if (antenna) {
      let _color, _state;

      if (!antenna.operational) {
        _color = 'var(--color-status-off)';
        _state = 'Not Operational';
      } else {
        if (antenna.loopback || (!antenna.loopback && antenna.hpa)) {
          _color = 'var(--color-status-normal)';
          if (antenna.loopback) {
            _state = 'Loopback';
          } else {
            _state = 'Actively Transmitting';
          }
        } else {
          _color = 'var(--color-status-critical)';
          _state = 'No Power';
        }
      }

      setAntColor(_color);
      setAntState(_state);

      if (antenna.locked) {
        setLockColor('var(--color-status-normal)');
        setLockState('Locked');
      } else if (!antenna.locked && antenna.track) {
        setLockColor('var(--color-status-standby)');
        setLockState('Tracking');
      } else if (!antenna.locked && !antenna.track) {
        setLockColor('var(--color-status-off)');
        setLockState('Unlocked');
      }
    }
  }, [sewAppCtx.antenna]);

  return (
    <>
    <AntennaHelp modalState={modalState} setModalState={setModalState} />

        <EquipmentCase2
            title='Antenna'
            unit={unit}
            units={units}
            setUnit={setUnit}
            icon={icons}
            modalState={modalState}
            setModalState = {setModalState}>
            <AntennaController unit={unit} />
        </EquipmentCase2>
        </>
  );
};
