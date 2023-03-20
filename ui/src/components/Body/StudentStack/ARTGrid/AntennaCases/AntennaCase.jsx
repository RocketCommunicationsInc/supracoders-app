import React, { useState, useEffect } from 'react';
import { RuxTooltip, RuxIcon, RuxMenu, RuxMenuItem } from '@astrouxds/react'
import { AntennaController } from '../../../..';
import { EquipmentCase2 } from '../EquipmentCase2';
import  AntennaHelp from '../../HelpModals/AntennaHelp'
import { useSewApp } from '../../../../../context/sewAppContext';

export const AntennaCase = () => {
  const [modalState, setModalState] = useState(false);
  const [antColor, setAntColor] = useState({ant1:'var(--color-status-standby)', ant2:'var(--color-status-standby)'});
  const [antState, setAntState] = useState({ant1:'standby', ant2: 'standby'});
  const [lockColor, setLockColor] = useState({ant1:'var(--color-status-standby)', ant2:'var(--color-status-standby)'});
  const [lockState, setLockState] = useState({ant1:'standby', ant2: 'standby'});
  const [unit, setUnit] = useState(1)
  const sewAppCtx = useSewApp();
  const icons = (
              <>
                <RuxTooltip message={antState[`ant${unit}`]}>
                  <RuxIcon className="status-icons" icon="antenna" size="1.75rem" style={{ color: antColor[`ant${unit}`]}}/>
                </RuxTooltip>
                <RuxTooltip message={lockState[`ant${unit}`]}>
                  <RuxIcon className="status-icons" icon={lockState[`ant${unit}`] === 'Locked' ? 'lock' : 'lock-open'} size="1.75rem" style={{ color: lockColor[`ant${unit}`]}}/>
                </RuxTooltip>
              </>
              )

    //units menu
    const units =(<RuxMenu>
      {[1,2].map((singleUnit)=>{
      return(
        <RuxMenuItem key={singleUnit} onClick={()=>setUnit(singleUnit)}>
          <div><RuxIcon icon="antenna" size="20px" style={{ color: antColor[`ant${singleUnit}`]}}/>
          <span>{ 'Antenna ' + singleUnit}</span></div>
        </RuxMenuItem>
      )
      })}
    </RuxMenu>)

  //this controls the color states of icons
  useEffect(() => {
    const antennas = sewAppCtx.antenna;
    let _color = antColor
    let _state = antState
    let _lockState = lockState
    let _lockColor = lockColor

    for(const antenna of antennas){
      const antNum = `ant${antenna.id}`;
    if (antenna) {
      if (!antenna.operational) {
        _color = {..._color, [antNum]:'var(--color-status-off)'};
        _state = {..._state, [antNum]:'Not Operational'};
      } else {
        if (antenna.loopback || (!antenna.loopback && antenna.hpa)) {
          _color = {..._color, [antNum]:'var(--color-status-normal)'};
          if (antenna.loopback) {
            _state = {..._state, [antNum]:'Loopback'};
          } else {
            _state = {..._state, [antNum]:'Actively Transmitting'};
          }
        } else {
          _color = {..._color, [antNum]:'var(--color-status-critical)'};
          _state = {..._state, [antNum]:'No Power'};
        }
      }
      if (antenna.locked) {
        _lockColor = {..._lockColor, [antNum]:'var(--color-status-normal)'};
        _lockState = {..._lockState, [antNum]:'Locked'};
      } else if (!antenna.locked && antenna.track) {
        _lockColor = {..._lockColor, [antNum]:'var(--color-status-standby)'};
        _lockState = {..._lockState, [antNum]:'Tracking'};
      } else if (!antenna.locked && !antenna.track) {
        _lockColor = {..._lockColor, [antNum]:'var(--color-status-off)'};
        _lockState = {..._lockState, [antNum]:'Unlocked'};
      }
    }
  }
  setAntColor(_color);
  setAntState(_state);
  setLockColor(_lockColor);
  setLockState(_lockState);
}, [sewAppCtx.antenna, unit]);

  return (
    <>
      <AntennaHelp modalState={modalState} setModalState={setModalState} />
      <EquipmentCase2
          title='Antenna'
          unit={unit}
          units={units}
          icon={icons}
          modalState={modalState}
          setModalState = {setModalState}>
          <AntennaController unit={unit} />
      </EquipmentCase2>
    </>
  );
};
