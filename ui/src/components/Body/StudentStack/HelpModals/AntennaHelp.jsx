import React from 'react';
import PropTypes from 'prop-types';
import { RuxDialog } from '@astrouxds/react';

const AntennaHelp = ({ modalState, setModalState }) => {
  return (
    <RuxDialog header="Antenna" confirmText='Close' clickToClose open={modalState} onRuxdialogclosed={() => setModalState(false)}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Description</h3>
        <p>You have two antennas to use with your transmitters.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Pathway Switch</h3>
        <p>This switch allows you to select between loopback and the antenna.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>High Powered Amplifier</h3>
        <p>In order to transmit, the antenna must be connected to a high powered amplifier.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Target</h3>
        <p>This is the satellite your antenna is pointed at.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Band</h3>
        <p>In this simulation you can only use C or Ku bands currently. Depending on which band you choose will determine
          the upconversion and downconversion frequencies.</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Offset</h3>
        <p>{`When using loopback, the offset will be applied to simulate the satellite's internal offset. If you are using the antenna then the offset will be ignored.`}</p>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Auto-Track</h3>
        <p>You need to enable the antenna and then enable the auto-track feature to keep locked on to the satellites.</p>
    </RuxDialog>
  );
};

AntennaHelp.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default AntennaHelp;
