import React, { useState } from 'react';
import { RuxContainer, RuxTooltip, RuxIcon } from '@astrouxds/react'
import { TxCase } from './TxCase';
import TxCaseHelp from '../../HelpModals/TxCaseHelp';

export const TxCases = () => {
  const [modalState, setModalState] = useState(false);
  return (
    <>
    <TxCaseHelp modalState={modalState} setModalState={setModalState}/>
    <RuxContainer className="container-case transmitter">
    <div slot='header' style={{display: 'flex', justifyContent: 'space-between'}}>Transmitters 
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
        <div>{[1, 2].map(unit => {
          return <TxCase key={unit} unit={unit} />;
        })}</div>
        <div>{[3, 4].map(unit => {
          return <TxCase key={unit} unit={unit} />;
        })}</div>
    </RuxContainer>
    </>
  );
};
