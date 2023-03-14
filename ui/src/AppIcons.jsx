import React from 'react';
import { RuxIconAntenna, RuxIconLockOpen, RuxIconLock, RuxIconHelpOutline, RuxIconWarning, RuxIconSignalCellularAlt, RuxIconAntennaTransmit, RuxIconExitToApp, RuxIconClose, RuxIconWbSunny, RuxIconBrightness3, RuxIconLoop, RuxIconSettings, RuxIconPlayArrow, RuxIconPause } from '@astrouxds/react/dist/components';
export const AppIcons = () => {
    return (
            <span style={{display: 'none'}}>
                <RuxIconAntenna />
                <RuxIconLock />
                <RuxIconLockOpen />
                <RuxIconHelpOutline />
                <RuxIconSignalCellularAlt />
                <RuxIconWarning />
                <RuxIconExitToApp />
                <RuxIconAntennaTransmit />
                <RuxIconClose />
                <RuxIconWbSunny />
                <RuxIconBrightness3 />
                <RuxIconLoop />
                <RuxIconSettings />
                <RuxIconPlayArrow />
                <RuxIconPause />
            </span>
        )
}