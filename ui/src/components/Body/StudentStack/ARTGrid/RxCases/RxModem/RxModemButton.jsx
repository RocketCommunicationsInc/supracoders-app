import React, { useEffect, useRef } from 'react';
import { RuxTab } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { useSound } from 'use-sound';
import { selectSound } from '../../../../../../audio';

export const RxModemButton = ({ modemId, isActive, updateActiveModem }) => {
  const [playSelectSound] = useSound(selectSound);
  const el = useRef(null)
  useEffect(()=>{
    isActive ? el.current.classList.add('isActive') : el.current.classList.remove('isActive')
  }, [isActive])

  return (
    <RuxTab 
      id={`rx-modem-${modemId}`} 
      onClick={() => {
        playSelectSound();
        updateActiveModem(modemId);
      }} 
      ref={el}
    >
     Modem {modemId}
    </RuxTab>
    // <RuxButton
    //   secondary
    //   onClick={() => {
    //     playSelectSound();
    //     updateActiveModem(modemId);
    //   }} ref={el}>
    //   {modemId}
    // </RuxButton>
  );
};
RxModemButton.propTypes = {
  modemId: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  updateActiveModem: PropTypes.func.isRequired,
};
