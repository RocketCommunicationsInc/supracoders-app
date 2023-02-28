import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import './Injects.css';
import { AstroTheme } from '../../../../themes/AstroTheme';
import { satellites } from '../../../../constants';
import { CRUDdataTable } from '../../../../crud/crud';
import { useSewApp } from '../../../../context/sewAppContext';

export const Injects = () => {
  const sewAppCtx = useSewApp();
  
  useEffect(() => {
    fetch('http://localhost:8080/data/signal')
        .then(res => res.json())
        .then(res => sewAppCtx.updateSignal(res))
  }, [])
  
  const theme = AstroTheme;
  const [activeModem, setActiveModem] = useState(0);

  // Styles
  const sxCase = {
    flexGrow: 1,
    backgroundColor: theme.system.colors.backgroundSurfaceDefault,
    color: AstroTheme.typography.colors.primary,
    borderRadius: AstroTheme.reference.radius.base,
    boxShadow: AstroTheme.system.shadow.overlay,
    border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
    display: 'grid',
    gridTemplateColumns: '30px 6fr 4fr 2fr',
    justifyContent: 'space-between',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  };
  const sxCaseId = {
    color: AstroTheme.typography.colors.primary,
    margin: '8px',
    textAlign: 'center',
  };
  const sxModemButtonBox = {
    backgroundColor: AstroTheme.system.colors.backgroundSurfaceDefault,
    border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  };
  const sxValues = {
    fontWeight: 'bold',
    textDecoration: 'underline',
  };
  const sxInputBox = {
    backgroundColor: AstroTheme.system.colors.backgroundSurfaceDefault,
    margin: '8px',
    borderRadius: AstroTheme.reference.radius.base,
    display: 'flex',
    gap: AstroTheme.reference.spacing[1],
    flexDirection: 'column',
  };
  const sxInputRow = {
    display: 'grid',
    gridTemplateColumns: '80px 180px 80px',
    gridTemplateRows: 'auto',
    textAlign: 'left',
    gap: 'var(--spacing-4)',
    margin: '2px',
  };
  const sxInputApply = {
    backgroundColor: AstroTheme.system.colors.backgroundInteractiveDefault,
    color: AstroTheme.typography.colors.primary,
    margin: '8px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: AstroTheme.system.colors.backgroundInteractiveHover,
    }

  };
  const sxVideo = {
    margin: '10px',
    border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
    borderRadius: AstroTheme.reference.radius.base,
    backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
    width: '400px',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const sxTransmit = {
    cursor: 'pointer',
    margin: '8px',
    //boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
    border: sewAppCtx.signal[activeModem]?.operational ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.borderInteractiveDefault,
    backgroundColor: sewAppCtx.signal[activeModem]?.operational ? AstroTheme.reference.color.palette.green[500] : AstroTheme.system.colors.backgroundSurfaceDefault,
    color: sewAppCtx.signal[activeModem]?.operational ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveDefault,
    '&:hover': {
      backgroundColor: sewAppCtx.signal[activeModem]?.operational
        ? AstroTheme.reference.color.palette.green[400]
        : AstroTheme.system.colors.backgroundSurfaceDefault,
      color: sewAppCtx.signal[activeModem]?.operational ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
      border: sewAppCtx.signal[activeModem]?.operational ? '1px solid ' + AstroTheme.reference.color.palette.green[400] : '1px solid ' + AstroTheme.system.colors.borderInteractiveHover,
    },
  };

  // Modem Case Id
  const sidebar = [];
  ['S', 'I', 'G', 'N', 'A', 'L', 'S'].forEach((x, index) => {
    sidebar.push(
      <Typography key={index} sx={{ color: AstroTheme.typography.colors.primary }}>
        {x}
      </Typography>
    );
  });
  const RxCaseId = () => <Box sx={sxCaseId}>{sidebar}</Box>;
  // Modem selector buttons
  const RxModemButtonBox = () => (
    <Box sx={sxModemButtonBox}>
      {sewAppCtx.signal
        .sort((a, b) => a.id - b.id)
        .map((x, index) => (
          <RxModemButton key={index} modem={x.id} />
        ))}
    </Box>
  );
  const RxModemButton = ({ modem }) => {
    const timer = useRef();

    const onClickHandler = (e) => {
      clearTimeout(timer.current);
      if (e.detail === 1) {
        timer.current = setTimeout(setActiveModem(parseInt(e.target.innerText) - 1), 200);
      } else if (e.detail === 2) {
        let tmpData = [...sewAppCtx.signal];
        tmpData[activeModem].operational = !tmpData[activeModem].operational;
        sewAppCtx.updateSignal(tmpData);
        CRUDdataTable({ method: 'PATCH', path: 'signal', data: tmpData[activeModem] });
      }
    };
    return (
      <Button
        sx={{
          backgroundColor: sewAppCtx.signal[sewAppCtx.signal.map((x) => x.id).indexOf(modem)].operational
            ? AstroTheme.reference.color.palette.green[500] 
            : "none",
          color: sewAppCtx.signal[sewAppCtx.signal.map((x) => x.id).indexOf(modem)].operational ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveDefault,
          border: sewAppCtx.signal[sewAppCtx.signal.map((x) => x.id).indexOf(modem)].operational ? '1px solid ' + AstroTheme.reference.color.palette.green[500] : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveDefault,
          outline: modem - 1 == activeModem && 'var(--border-width-focus-default) solid var(--color-border-focus-default)',
          outlineOffset: modem - 1 == activeModem && 'var(--spacing-focus-default)',
          borderRadius: 'var(--radius-base)',
          margin: 'var(--spacing-2)',
          cursor: 'pointer',
          display: 'inline-flex',
          width: 'var(--spacing-14)',
          '&:hover': {
            backgroundColor: sewAppCtx.signal[sewAppCtx.signal.map((x) => x.id).indexOf(modem)].operational ? AstroTheme.reference.color.palette.green[400] : AstroTheme.system.colors.backgroundSurfaceDefault,
            color: sewAppCtx.signal[sewAppCtx.signal.map((x) => x.id).indexOf(modem)].operational ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
          },
        }}
        onClick={(e) => {
          onClickHandler(e);
        }}>
        {modem}
      </Button>
    );
  };
  RxModemButton.propTypes = { modem: PropTypes.number };

  // Modem User Inputs
  const RxModemInput = () => {
    const index = sewAppCtx.signal.map((x) => x.id).indexOf(activeModem + 1);
    const [inputData, setInputData] = useState(sewAppCtx.signal[index]);
    const handleInputChange = ({ param, val }) => {
      let tmpData = { ...inputData };
      tmpData[param] = val;
      setInputData(tmpData);
    };

    const handleApply = () => {
      const tmpData = [...sewAppCtx.signal];
      tmpData[index] = inputData;
      sewAppCtx.updateSignal(tmpData);
      CRUDdataTable({ method: 'PATCH', path: 'signal', data: tmpData[index] });
    };

    const handleTransmit = () => {
      let tmpData = [...sewAppCtx.signal];
      tmpData[index].operational = !tmpData[index].operational;
      sewAppCtx.updateSignal(tmpData);
      CRUDdataTable({ method: 'PATCH', path: 'signal', data: tmpData[index] });
    };

    return (
      <div>
        <Box sx={sxInputBox}>
                <Box sx={sxInputRow}>
                  <label htmlFor='Satellite'>Satellite</label>
                  <select
                    name='Satellite'
                    value={inputData.target_id}
                    onChange={(e) =>
                      handleInputChange({
                        param: 'target_id',
                        val: parseInt(e.target.value),
                      })
                    }>
                    {satellites.map((x, index) => (
                      <option key={index} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                  <Typography sx={sxValues}>{satellites[sewAppCtx.signal[index]]?.name}</Typography>
                </Box>
                <Box sx={sxInputRow}>
                  <label htmlFor='frequency'>Frequency</label>
                  <input
                    name='frequency'
                    type='text'
                    value={inputData.frequency}
                    onChange={(e) =>
                      handleInputChange({
                        param: 'frequency',
                        val: parseInt(e.target.value) || 0,
                      })
                    }></input>
                  <Typography sx={sxValues}>{sewAppCtx.signal[index].frequency + ' MHz'}</Typography>
                </Box>
                <Box sx={sxInputRow}>
                  <label htmlFor='bandwidth'>Bandwidth</label>
                  <input
                    name='bandwidth'
                    type='text'
                    value={inputData.bandwidth}
                    onChange={(e) =>
                      handleInputChange({
                        param: 'bandwidth',
                        val: parseInt(e.target.value) || 0,
                      })
                    }></input>
                  <Typography sx={sxValues}>{sewAppCtx.signal[index].bandwidth + ' MHz'}</Typography>
                </Box>
                <Box sx={sxInputRow}>
                  <label htmlFor='modulation'>Modulation</label>
                  <select
                    name='modulation'
                    value={inputData.modulation}
                    onChange={(e) => handleInputChange({ param: 'modulation', val: e.target.value || 0 })}>
                    <option value='BPSK'>BPSK</option>
                    <option value='QPSK'>QPSK</option>
                    <option value='8QAM'>8QAM</option>
                    <option value='16QAM'>16QAM</option>
                  </select>
                  <Typography sx={sxValues}>{sewAppCtx.signal[index].modulation}</Typography>
                </Box>
                <Box sx={sxInputRow}>
                  <label htmlFor='fec'>FEC</label>
                  <select
                    name='fec'
                    value={inputData.fec}
                    onChange={(e) => handleInputChange({ param: 'fec', val: e.target.value || 0 })}>
                    <option value='1/2'>1/2</option>
                    <option value='2/3'>2/3</option>
                    <option value='3/4'>3/4</option>
                    <option value='5/6'>5/6</option>
                    <option value='7/8'>7/8</option>
                  </select>
                  <Typography sx={sxValues}>{sewAppCtx.signal[index].fec}</Typography>
                </Box>
                <Box sx={sxInputRow}>
                  <label htmlFor='feed'>Feed</label>
                  <select
                    name='feed'
                    value={inputData.feed}
                    onChange={(e) => handleInputChange({ param: 'feed', val: e.target.value })}>
                    <option value='blue 1.mp4'>Blue 1</option>
                    <option value='blue 2.mp4'>Blue 2</option>
                    <option value='red 1.mp4'>Red 1</option>
                    <option value='red 2.mp4'>Red 2</option>
                    <option value='red 3.mp4'>Red 3</option>
                    <option value='red 4.mp4'>Red 4</option>
                    <option value='red 5.mp4'>Red 5</option>
                    <option value='red 6.mp4'>Red 6</option>
                    <option value='red 7.mp4'>Red 7</option>
                    <option value='red 8.mp4'>Red 8</option>
                    <option value='red 9.mp4'>Red 9</option>
                  </select>
                  <Typography sx={sxValues}>{sewAppCtx.signal[activeModem].feed}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button sx={sxInputApply} onClick={(e) => handleApply(e)}>
                Apply
              </Button>
              <Button sx={sxTransmit} onClick={(e) => handleTransmit(e)}>
                TX
              </Button>
            </Box>
      </div>
    );
  };

  const RxVideo = () => {
    return (
      <Box sx={sxVideo}>
        <ReactPlayer
          config={{ file: { attributes: { controlsList: 'nodownload' } } }}
          //onContextMenu={(e) => e.preventDefault()}
          url={`./videos/${sewAppCtx.signal[activeModem].feed}`}
          width='100%'
          height='100%'
          controls={false}
          playing={true}
          loop={true}
          pip={false}
          muted={true}
        />
      </Box>
    );
  };

  return (
    <>
      <Box sx={sxCase}>
        <RxCaseId />
        <RxModemButtonBox />
        <RxModemInput />
        <RxVideo />
      </Box>
    </>
  );
};
