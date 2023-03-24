import React from 'react';
import { RuxIconAntenna, RuxIconLockOpen, RuxIconLock, RuxIconHelp, RuxIconWarning, RuxIconSignalCellularAlt, RuxIconAntennaTransmit, RuxIconExitToApp, RuxIconClose, RuxIconWbSunny, RuxIconBrightness3, RuxIconLoop, RuxIconSettings, RuxIconPlayArrow, RuxIconPause, RuxIconArrowDropUp, RuxIconArrowDropDown, RuxIconPerson } from '@astrouxds/react/dist/components';
export const AppIcons = () => {
    return (
            <span style={{display: 'none'}}>
                <RuxIconAntenna />
                <RuxIconLock />
                <RuxIconLockOpen />
                <RuxIconHelp />
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
                <RuxIconArrowDropUp />
                <RuxIconArrowDropDown />
                <RuxIconPerson />
            </span>
        )
}