import React, { useState } from 'react';
import { RuxCard, RuxIcon, RuxTooltip } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { EquipmentCaseId } from './EquipmentCaseId';
import './equipmentCase.css';
import { InstructionsIcon } from '../HelpModals/InstructionsIcon';
export const EquipmentCase = ({ children, title, helpTitle, helpComponent, unit, icon, tabs, tabPanels }) => {
  const [helpState, setHelpState] = useState(false);

  return (
    <>
      {helpComponent({ modalState: helpState, setModalState: setHelpState })}
      <RuxCard className="container_equipment-case">
        <div slot="header">{title + ` ` + unit}
        <div>{tabs}</div>
        </div>
        <Grid container>
          <div>{tabPanels}</div>
          <Grid item mr={1} width={30}>
            <EquipmentCaseId unit={unit} icon={icon} />
          </Grid>
          <Grid item xs={true}>
            {children}
          </Grid>
          <Grid item xs={'auto'} ml={0}>
            <RuxTooltip message={helpTitle} placement='top'>
              <RuxIcon icon='help-outline'
              size='24px'
              className='helpIcon'
              style={{ paddingLeft: '8px' }}
                onClick={() => {
                  setHelpState(true);
                }} />
            </RuxTooltip>
          </Grid>
        </Grid>
      </RuxCard>
    </>
  );
};

EquipmentCase.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  helpTitle: PropTypes.string.isRequired,
  helpComponent: PropTypes.func.isRequired,
  unit: PropTypes.number.isRequired,
  icon: PropTypes.node,
  tabs: PropTypes.node,
  tabPanels: PropTypes.node,
};
