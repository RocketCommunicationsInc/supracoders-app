import React, {useState} from 'react';
import { RuxIcon, RuxPopUp,RuxMenu, RuxMenuItem } from '@astrouxds/react'
import { RxCase } from './RxCase';
import RxCaseHelp from '../../HelpModals/RxCaseHelp';

export const RxCases = () => {
  const [modalState, setModalState] = useState(false);
  const [activeCase , setActiveCase] = useState(1)
  const cases = [1,2,3,4]

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
                    { 'Receiver ' + singleUnit} {activeCase}
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
    <RxCaseHelp modalState={modalState} setModalState={setModalState}/>
      <div className="case-grid">
        {cases.map((unit) => (
          <RxCase unit={unit} key={unit} help={help} dropdown={dropdown} activeCase={activeCase} />
        ))}
      </div>
    </>
  );
};
