import React, {useEffect, useRef} from 'react';
import { RuxMonitoringProgressIcon} from '@astrouxds/react'
import { PropTypes } from 'prop-types';

export const PowerMonitor = ({rawPower}) =>{
// const MED= 75;
// const HIGH=90
const monitor = useRef(null)
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

useEffect(() => {
  const circles = Array.from(monitor.current.shadowRoot.querySelectorAll('circle'));
  circles.map((circle)=>{
    // eslint-disable-next-line no-undef
    circle.setAttribute('stroke-width', 4)
  })

}, [])


    return(<>
    <RuxMonitoringProgressIcon className="power-monitor" range={rangeItems} progress={rawPower} label="Power" ref={monitor} />
    </>)
}

PowerMonitor.propTypes = {
    rawPower: PropTypes.number.isRequired,
  };