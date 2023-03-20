import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './equipmentCase.css';
export const EquipmentCase = ({ children, title, unit, icon, tabs, dropdown, activeCase, help }) => {

  return (
      <RuxContainer style={{overflow: 'hidden', display: activeCase === unit ? 'flex' : 'none'}}>
        <div slot="header" style={{display: 'flex', justifyContent: 'space-between'}}>
          <div className="grid-header" style={{ display: 'flex', alignItems: 'center', }}>
            {icon} {title + ` ` + unit} {dropdown}
          </div>
          {help}
        </div>
        {tabs ? <div slot="tab-bar">{tabs}</div> : null}
        <Grid container>
          <Grid item xs={true}>
            {children}
          </Grid>
        </Grid>
      </RuxContainer>
  );
};

EquipmentCase.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  unit: PropTypes.number.isRequired,
  icon: PropTypes.node,
  tabs: PropTypes.node,
  dropdown: PropTypes.node,
  activeCase: PropTypes.number,
  help: PropTypes.node,
};
