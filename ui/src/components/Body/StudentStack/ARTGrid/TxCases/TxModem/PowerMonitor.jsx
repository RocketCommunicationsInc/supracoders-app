import React from 'react';
import { RuxMonitoringProgressIcon} from '@astrouxds/react'
import { PropTypes } from 'prop-types';

export const PowerMonitor = ({rawPower}) =>{
// eslint-disable-next-line no-undef
const rangeItems = [
    {
      "threshold": 0,
      "status": "off"
    },
    {
      "threshold": 25,
      "status": "standby"
    },
    {
      "threshold": 50,
      "status": "normal"
    },
    {
      "threshold": 75,
      "status": "caution"
    },
    {
      "threshold": 90,
      "status": "serious"
    },
    {
      "threshold": 100,
      "status": "critical"
    }
  ]

const loadStyles = (current) =>{
  if(current === null) return;

  const circles = Array.from(current.shadowRoot.querySelectorAll('circle'));
  circles.map((circle)=>{
    // eslint-disable-next-line no-undef
    circle.setAttribute('stroke-width', 4)
  })
}

    return(<>
    <RuxMonitoringProgressIcon className="power-monitor" range={rangeItems} progress={rawPower} label="Power" ref={(current)=>loadStyles(current)} />
    </>)
}

PowerMonitor.propTypes = {
    rawPower: PropTypes.number.isRequired,
  };