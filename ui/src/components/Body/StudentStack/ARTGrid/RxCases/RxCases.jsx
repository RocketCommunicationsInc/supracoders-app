import React, {useState} from 'react';
import { RuxContainer, RuxTooltip, RuxIcon } from '@astrouxds/react'
import { RxCase } from './RxCase';
import RxCaseHelp from '../../HelpModals/RxCaseHelp';

export const RxCases = () => {
  const [modalState, setModalState] = useState(false);
  return (
    <>
    <RxCaseHelp modalState={modalState} setModalState={setModalState}/>
    <RuxContainer className="container-case receiver">
    <div slot='header' style={{display: 'flex', justifyContent: 'space-between'}}>Receivers
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
      <div>
        {[1, 2].map((unit) => (
          <RxCase unit={unit} key={unit} />
        ))}
      </div>
      <div>
        {[3, 4].map((unit) => (
          <RxCase unit={unit} key={unit} />
        ))}
      </div>
    </RuxContainer>
    </>
  );
};
