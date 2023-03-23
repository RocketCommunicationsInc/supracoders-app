import React from 'react';
import PropTypes from 'prop-types';
import { RuxDialog } from '@astrouxds/react';

const RxCaseHelp = ({ modalState, setModalState }) => {
  return (
    <RuxDialog header="Receiver Case" confirmText='Close' clickToClose open={modalState} onRuxdialogclosed={() => setModalState(false)}>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Description</h3>
      <p>There are 4 receiver cases each containing 4 receiver modems (16 total). The signal is converted to L-Band and  then if the settings are corrected it will be displayed on the monitor.</p>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Antenna</h3>
      <p>Select which antenna the receiver should be connected to.</p>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Frequency</h3>
      <p>Set the frequency the receiver is centered on.</p>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Bandwidth</h3>
      <p>{`Select the bandwidth (how wide the signal is). If the bandwidth is too small you won't see the whole signal, but if it is too big you will have too much noise mixed into the signal.`}</p>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Modulation</h3>
      <p>Set how the signal is modulated. These four options are common methods for encoding the data into a signal.  This is typically provided by the company or intel.</p>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Forward Error Correction</h3>
      <p>Set the error correction scheme for the signal. This is typically provided by the company or intel.</p>
    </RuxDialog>
  );
};

RxCaseHelp.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default RxCaseHelp;
