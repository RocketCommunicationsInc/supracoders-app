import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import { AntennaCase } from './AntennaCase';

export const AntennaCases = () => {
  return (
    <RuxContainer className="container-case antenna">
      <div slot='header'>Antennas</div>
      {[1, 2].map(unit => (
        <AntennaCase key={unit} unit={unit} />
      ))}
    </RuxContainer>
  );
};
