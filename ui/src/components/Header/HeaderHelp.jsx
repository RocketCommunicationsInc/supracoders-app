import React from 'react';
import PropTypes from 'prop-types';
import { RuxDialog } from '@astrouxds/react';

const HeaderHelp = ({ modalState, setModalState }) => {
  return (
      <RuxDialog clickToClose header='IRIS Space Electronic Warfare Sandbox' class="main-help" confirmText='Close' open={modalState} onRuxdialogclosed={() => setModalState(false)}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Introduction</h3>
          <p>
            IRIS is a training environment to help learn how Space Electronic Warfare works. In front of you are:
          </p>
          <ul>
            <li>4x Spectrum Analyzers</li>
            <li>2x Antennas</li>
            <li>4x Transmitter Cases</li>
            <li>16x Transmitter Modems</li>
            <li>4x Receiver Cases</li>
            <li>16x Receiver Modems</li>
          </ul>
          <p>
            Using this equipment you can analyze satellites, determine the signals they are transmitting, view video
            feeds on those signals, and then generate your own signals to degrade or disable them.
          </p>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Example Scenario</h3>
          <p>
            Satellite ARKE 3G is currently transmitting a UAV video feed in C-Band at frequency 4810 Mhz. Intel
            assessment is that they are utilizing 8QAM modulation and a forward error correction (FEC) of 3/4.
          </p>
          <p>
            Your transmitters and receivers operate with an intermediate frequency (IF) in L-Band. When they are
            converted to C-Band the IF will increase by 3350 Mhz. When it is then downcoverted back to L-Band it will
            decrease by 3500 Mhz.
          </p>
          <p>
            Since the satellite cannot transmit and receive on the same frequency, it will offset the frequency it
            receives by 400 Mhz. With all of this information, see if you can find the signal on ARKE 3G and disrupt it
            with your transmitters!
          </p>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0', }}>Why So Much Equipment?</h3>
          <p>
            Students in the United States Space Force often work in teams sharing equipment. In order to accurate mimic
            this you have access to all of the equipment on your screen. If you are connected to a server (not Github)
            then your changes will impact other students in your server. If you are playing alone, then you most likely
            will not need all of the equipment.
          </p>
          <h4 style={{marginBottom: '0'}}>Design</h4>
          <p>This Astro 7 version of IRIS is based on the original IRIS created by <a href='https://github.com/thkruz/' target='_new'>Theodore Kruczek</a><br />
          Copyright © 2023. All rights reserved. Source Code licensed under{' '}<a href='https://raw.githubusercontent.com/thkruz/iris/dev/LICENSE.md'target='_new'>AGPLv3</a>
          </p>
        </div>
      </RuxDialog>
  );
};

HeaderHelp.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default HeaderHelp;
