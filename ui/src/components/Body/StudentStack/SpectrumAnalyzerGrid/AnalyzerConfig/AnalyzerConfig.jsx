import React from 'react';
import { RuxRadioGroup, RuxRadio, RuxCheckboxGroup, RuxCheckbox } from '@astrouxds/react'
import { PropTypes } from 'prop-types';
import useSound from 'use-sound';
import { selectSound } from '../../../../../audio';

export const AnalyzerConfig = (props) => {
    const [isTraceOn, setIsTraceOn] = useState(false);
    const [isMarkerOn, setIsMarkerOn] = useState(false);




    // Used for holding max amplitude
    const handleHoldClick = () => {
        playSelectSound();
        if (typeof currentSpecAnalyzer.resetHoldData !== 'undefined') {
        currentSpecAnalyzer.resetHoldData();
        currentSpecAnalyzer.isDrawHold = !currentSpecAnalyzer.isDrawHold;
        setIsTraceOn(currentSpecAnalyzer.isDrawHold);
        }
    };

    // Used for marking max amplitude
    const handleMarkerClick = () => {
        playSelectSound();
        currentSpecAnalyzer.isDrawMarker = !currentSpecAnalyzer.isDrawMarker;
        setIsMarkerOn(currentSpecAnalyzer.isDrawMarker);
    };

  return (
    <div style={{ display: 'flex', }}>
                  <RuxRadioGroup
                    className='config-radio-group'
                    style={{ paddingRight: 'var(--spacing-8)' }}
                    name="Antennas" 
                    label="Antenna"
                    onRuxchange={(e) => {
                        updateSpecAwAntennaInfo(parseInt(e.target.value), sewAppCtx.sewApp[`specA${whichSpecA}`], false)
                        setCurrentAntennaInAnalyzer(e.target.value)
                      }
                    }
                  >
                    <RuxRadio value="1" name="Antennas">
                    Antenna 1
                    </RuxRadio>
                    <RuxRadio value="2" name="Antennas">
                    Antenna 2
                    </RuxRadio>
                  </RuxRadioGroup>
                  <RuxRadioGroup
                    className='config-radio-group'
                    style={{ paddingRight: 'var(--spacing-8)' }}
                    name="Frequency" 
                    label="Frequency"
                    onRuxchange={() => {
                      handleRfClicked()
                    }}
                  >
                    <RuxRadio value="Radio" name="Frequency">
                    Radio
                    </RuxRadio>
                    <RuxRadio value="Intermediate" name="Frequency">
                    Intermediate
                    </RuxRadio>
                  </RuxRadioGroup>
                  <RuxCheckboxGroup
                  className='config-checkbox-group'
                    name='viewOptions'
                    label='View Options'
                  >
                    <RuxCheckbox value='trace' name='viewOptions' checked={isTraceOn} onRuxchange={handleHoldClick}>
                      Trace
                    </RuxCheckbox>
                    <RuxCheckbox value='marker' name='viewOptions' checked={isMarkerOn} onRuxchange={handleMarkerClick}>
                      Marker
                    </RuxCheckbox>
                  </RuxCheckboxGroup>
                </div>
  );
};

AnalyzerConfig.propTypes = {
  currentSpecAnalyzer: PropTypes.object,
};
