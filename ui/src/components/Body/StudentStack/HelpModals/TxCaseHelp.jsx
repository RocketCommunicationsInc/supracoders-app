import React from 'react';
import PropTypes from 'prop-types';
import { RuxDialog } from '@astrouxds/react';

const TxCaseHelp = ({ modalState, setModalState }) => {
  return (
    <RuxDialog header="Transmitter Case" clickToClose confirmText='Close' open={modalState} onRuxdialogclosed={() =>  setModalState(false)}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Description</h3>
        <p>There are 4 transmitter cases each containing 4 transmitter modems (16 total). The signal is in L-Band and isupconverted at the antenna.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Antenna</h3>
        <p>Select which antenna the transmitter should be connected to.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Frequency</h3>
        <p>Set the frequency the transmitter is centered on.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Bandwidth</h3>
        <p>{`Select the bandwidth (how wide the signal is). The higher the bandwidth, the more power is used. If the bandwidth is too small you won't jam the whole signal, but if it is too big you may impact other signals.`}</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Power</h3>
        <p>{`Set the power of the signal. The higher the power, the more power is used. If the power is too low you won't jam the signal.`}</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Power %</h3>
        <p>{`This is the percentage of the power that is used. You can't use more power than you have!`}</p>
    </RuxDialog>
  );
};

TxCaseHelp.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default TxCaseHelp;
