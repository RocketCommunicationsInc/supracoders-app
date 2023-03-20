import React, { useEffect, useRef} from 'react'
import { RuxNotification } from "@astrouxds/react"
import { PropTypes } from 'prop-types'
import './notification-banner.css'
import { useSewApp } from '../../../context/sewAppContext';


export const NotificationBanner = ()=>{
    const banner = useRef(null)
    const sewAppCtx = useSewApp()
    const { notification, updateNotification } = sewAppCtx
    
    useEffect(() => {
        banner.current.addEventListener('ruxclosed', ()=>{
            updateNotification(false)
        })
    }, [])
    
    
    return <RuxNotification className="notification-banner"  open={notification.isOpen} status={notification.status} message={notification.message} closeAfter={notification.time} ref={banner} />
}

NotificationBanner.propTypes = {
    status: PropTypes.string,
    message: PropTypes.string,
    time: PropTypes.number,

}