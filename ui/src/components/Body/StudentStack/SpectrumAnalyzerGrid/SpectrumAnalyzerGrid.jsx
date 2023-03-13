import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { RuxDialog, RuxContainer, RuxTooltip, RuxIcon } from '@astrouxds/react'
import SpecAHelp from '../HelpModals/SpecAHelp';
import { SpectrumAnalyzerBox, AnalyzerControl } from '../../../';

export const SpectrumAnalyzerGrid = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentSpecAnalyzer, setCurrentSpecAnalyzer] = useState(null);
  const [isHelpModalActive, setIsHelpModalActive] = useState(false);

  const handleConfigClick = (specAnalyzer) => {
    setCurrentSpecAnalyzer(specAnalyzer);
    setIsConfigOpen(true);
  };

  const handleRfClick = (specAnalyzer) => {
    setCurrentSpecAnalyzer(specAnalyzer);
  };

  const handlePauseClicked = (specAnalyzer) => {
    setCurrentSpecAnalyzer(specAnalyzer);
  };

  const handleBackgroundClick = (e) => {
    // Don't hide the screen unless the background was clicked
    // NOTE: Any click action triggers this event
    if (e.target.id === 'analyzerControlModalOverlay') {
      setIsConfigOpen(false);
    }
  };

  return (
    <>
    <SpecAHelp modalState={isHelpModalActive} setModalState={setIsHelpModalActive} />
    <RuxContainer style={{ paddingLeft: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', }}>
      <div slot='header' style={{ display: 'flex', justifyContent: 'space-between', }}>
        <div>Spectrum Analyzers</div>
        <RuxTooltip message='Spectrum Analyzer Help' placement='top'>
          <RuxIcon
            icon='help-outline'
            size='24px'
            className='helpIcon'
            onClick={() => {
              setIsHelpModalActive(true);
            }}>
          </RuxIcon>
        </RuxTooltip>
      </div>
      <Grid container item spacing={2} xs={12}>
        <Grid container item spacing={2} xs={12} lg={6}>
          {[1, 2].map((unit) => (
            <Grid key={unit} item xs={true} minWidth={300}>
              {
                <SpectrumAnalyzerBox
                  handleConfigClick={handleConfigClick}
                  handleRfClick={handleRfClick}
                  handlePauseClicked={handlePauseClicked}
                  canvasId={`specA${unit}`}
                />
              }
            </Grid>
          ))}
        </Grid>
        <Grid container item spacing={2} xs={12} lg={6}>
          {[3, 4].map((unit) => (
            <Grid key={unit} item xs={true} minWidth={300}>
              {
                <SpectrumAnalyzerBox
                  handleConfigClick={handleConfigClick}
                  handleRfClick={handleRfClick}
                  handlePauseClicked={handlePauseClicked}
                  canvasId={`specA${unit}`}
                />
              }
            </Grid>
          ))}
        </Grid>
      </Grid>
      </RuxContainer>
      {isConfigOpen ? (
        <RuxDialog open={isConfigOpen} clickToClose onRuxdialogclosed={() => setIsConfigOpen(false)} className="analyzer-config">
          <div slot="header" className="header">
            <span>Spectrum Analyzer Config</span><RuxIcon icon="close" size="var(--font-heading-2-font-size)"  onClick={()=>setIsConfigOpen(false)} />
          </div>
          <AnalyzerControl currentSpecAnalyzer={currentSpecAnalyzer} handleBackgroundClick={handleBackgroundClick} />
        </RuxDialog>
      ) : null}
    </>
  );
};
