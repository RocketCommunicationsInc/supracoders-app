import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import { TxCase } from './TxCase';

export const TxCases = () => {
  return (
    <RuxContainer className="container-case transmitter">
      <div slot='header'>Transmitters</div>
        <div>{[1, 2].map(unit => {
          return <TxCase key={unit} unit={unit} />;
        })}</div>
        <div>{[3, 4].map(unit => {
          return <TxCase key={unit} unit={unit} />;
        })}</div>
    </RuxContainer>
  );
};
