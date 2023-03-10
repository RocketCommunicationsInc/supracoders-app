import React, {useState} from 'react';
import { RuxContainer, RuxTooltip, RuxIcon } from '@astrouxds/react'
import { AntennaCase } from './AntennaCase';
import AntennaHelp from '../../HelpModals/AntennaHelp'

export const AntennaCases = () => {
   const [modalState, setModalState] = useState(false);
  return (
    <>
    <AntennaHelp modalState={modalState} setModalState={setModalState} />
    <RuxContainer className="container-case antenna">
      <div slot='header' style={{display: 'flex', justifyContent: 'space-between'}}>Antennas 
      <RuxTooltip message='Antenna Help' placement='top'>
        <RuxIcon icon='help-outline'
        size='24px'
        className='helpIcon'
        style={{ paddingLeft: '8px' }}
          onClick={() => {
            setModalState(true);
          }} />
      </RuxTooltip>
      </div>
      {[1, 2].map(unit => (
        <AntennaCase key={unit} unit={unit} />
      ))}
    </RuxContainer>
    </>
  );
};
