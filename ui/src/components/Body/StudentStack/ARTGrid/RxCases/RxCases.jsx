import React, {useState} from 'react';
import { RuxIcon, RuxButton, RuxPopUp, RuxMenu, RuxMenuItem } from '@astrouxds/react'
import { RxCase } from './RxCase';
import { useSewApp } from './../../../../../context/sewAppContext';
import RxCaseHelp from '../../HelpModals/RxCaseHelp';

export const RxCases = () => {
  const [modalState, setModalState] = useState(false);
  const [activeCase , setActiveCase] = useState(1)
  const cases = [1,2,3,4]
  const sewAppCtx = useSewApp();

  const equipStatus = cases.map((unit) => {
    const currentModems = sewAppCtx.rx.filter(
      (rx) =>rx.unit === unit);
    const isFound = currentModems.filter((rx) => rx.found).length > 0;
    const isDegraded = currentModems.filter((rx) => rx.degraded).length > 0;
    const isDenied = currentModems.filter((rx) => rx.denied).length > 0;

    let color = '';
    if (isFound && !isDegraded && !isDenied) {
      color = 'var(--color-status-normal)';
    } else if (isFound && isDegraded && !isDenied) {
      color = 'var(--color-status-caution)';
    } else if (isFound && isDenied) {
      color = 'var(--color-status-critical)';
    } else {
      color = 'var(--color-status-off)';
    }
    return color
  });

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
                    <div><RuxIcon icon="signal-cellular-alt" size="1.25rem" style={{ color: equipStatus[singleUnit - 1]}}/>
                      <span>{ 'Receiver ' + singleUnit}</span></div>
                </RuxMenuItem>
              )
              })}
            </RuxMenu>
        </RuxPopUp>
      </>
    )

    const help = (
      <RuxButton borderless iconOnly icon='help' size='20px' className='helpIcon'
      style={{ paddingLeft: '8px' }}
        onClick={() => {
          setModalState(true);
        }} />
    )

  return (
    <>
    <RxCaseHelp modalState={modalState} setModalState={setModalState}/>
      <div className="case-grid">
        {cases.map((unit) => (
          <RxCase unit={unit} key={unit} help={help} dropdown={dropdown} activeCase={activeCase} />
        ))}
      </div>
    </>
  );
};
