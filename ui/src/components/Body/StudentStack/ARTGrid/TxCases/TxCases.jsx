import React, { useState } from 'react';
import { RuxIcon, RuxPopUp, RuxMenu, RuxMenuItem} from '@astrouxds/react'
import { TxCase } from './TxCase';
import TxCaseHelp from '../../HelpModals/TxCaseHelp';
import { useSewApp } from '../../../../../context/sewAppContext';

export const TxCases = () => {
  const [modalState, setModalState] = useState(false);
  const [activeCase , setActiveCase] = useState(1)
  const cases = [1,2,3,4]
  const sewAppCtx = useSewApp();

  const checkTransmitting = (unit) =>{
    const transmit = sewAppCtx.tx
      .filter(
        (tx) =>
          tx.id === (unit - 1) * 4 + 1 ||
          tx.id === (unit - 1) * 4 + 2 ||
          tx.id === (unit - 1) * 4 + 3 ||
          tx.id === (unit - 1) * 4 + 4
      )
      .filter((tx) => tx.transmitting).length > 0;

      return transmit;

  }

  const dropdown = (
          <>
            <RuxPopUp disableAutoUpdate placement="bottom">
              <div slot='trigger' style={{ display: 'flex', paddingRight: 'var(--spacing-3)' }}>
                <RuxIcon icon={'arrow-drop-down'} size='24px' style={{paddingLeft: 'var(--spacing-1)'}} />
              </div>
              <RuxMenu>
                  {cases.map((singleUnit)=>{
                    
                  return(
                    <RuxMenuItem key={singleUnit} onClick={()=> setActiveCase(singleUnit)} selected={singleUnit === activeCase ? 'true' : 'false'}>
                      <div><RuxIcon icon="antenna" size="1rem" style={{ color: checkTransmitting(singleUnit) ? 'var(--color-status-normal)' : 'var(--color-status-off)'}}
            /><span>{ 'Transmitter ' + singleUnit}</span></div>
                    </RuxMenuItem>
                  )
                  })}
                </RuxMenu>
            </RuxPopUp>
          </>
      )
      
      const help = (
        <RuxIcon icon='help'
        size='24px'
        className='helpIcon'
        style={{ paddingLeft: '8px' }}
          onClick={() => {
            setModalState(true);
          }} />)


  return (
    <>
    <TxCaseHelp modalState={modalState} setModalState={setModalState}/>
        <div className="case-grid">{cases.map(unit => {
          return <TxCase key={unit} unit={unit} help={help} dropdown={dropdown} activeCase={activeCase} />;
        })}</div>
    </>
  );
};
