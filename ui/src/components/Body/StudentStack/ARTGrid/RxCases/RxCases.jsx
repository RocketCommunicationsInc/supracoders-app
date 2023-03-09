import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import { RxCase } from './RxCase';

export const RxCases = () => {
  return (
    <RuxContainer className="container-case receiver">
      <div slot='header'>Receivers</div>
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
  );
};
