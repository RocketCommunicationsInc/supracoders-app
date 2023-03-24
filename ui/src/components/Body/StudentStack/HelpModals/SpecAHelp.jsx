import React from 'react';
import PropTypes from 'prop-types';
import { RuxDialog } from '@astrouxds/react';

const SpecAHelp = ({ modalState, setModalState }) => {
  return (
    <RuxDialog clickToClose header="Spectrum Analyzer" confirmText='Close' open={modalState}  onRuxdialogclosed={() => setModalState(false)}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Description</h3>
        <p>The spectrum analyzer is used to view the analog signal on the EM spectrum. The higher the peak, the more
          power that is detected.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Antenna</h3>
        <p>Select which antenna the spectrum analyzer should be connected to.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Config</h3>
        <p>Opens the configuration menu. Use this to change the center frequency and span of the spectrum analyzer. The
          hold function will maintain the highest power in the spectrum analyzer until cleared.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>IF / RF</h3>
        <p>Toggle between Intermediate Frequency and the Radio Frequency.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Pause</h3>
        <p>Pause the spectrum analyzer.</p>
    </RuxDialog>
  );
};

SpecAHelp.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default SpecAHelp;
