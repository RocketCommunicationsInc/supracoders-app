import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { RuxTab, RuxIcon } from '@astrouxds/react'
import { selectSound } from '../../../../../../audio';
import { useSound } from 'use-sound';



export const TxModemButton = ({ modemId, updateActiveModem, isActive, isTransmitting }) => {
  const [playSelectSound] = useSound(selectSound);
  const el = useRef(null)
  useEffect(()=>{
    // isActive ? el.current.classList.add('isActive') : el.current.classList.remove('isActive')
    isTransmitting ? el.current.classList.add('isTransmitting') : el.current.classList.remove('isTransmitting')
  }, [isActive, isTransmitting])

  return (
    <RuxTab 
      id={`modem-${modemId}`} 
      onClick={()=>{
        playSelectSound();
        updateActiveModem(modemId);
      }} 
      ref={el}
    >
     {isTransmitting ? <RuxIcon icon='antenna-transmit' size='24px' style={{ color: 'var(--color-status-normal)', paddingRight: '4px' }} /> : <RuxIcon icon='antenna-transmit' size='24px' style={{ paddingRight: '4px' }} />} Modem {modemId}
    </RuxTab>
  );
};

TxModemButton.propTypes = {
  modemId: PropTypes.number.isRequired,
  isTransmitting: PropTypes.bool.isRequired,
  isActive: PropTypes.bool,
  updateActiveModem: PropTypes.func.isRequired,
};
