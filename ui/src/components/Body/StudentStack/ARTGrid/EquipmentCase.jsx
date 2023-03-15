import React from 'react';
import { RuxContainer } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './equipmentCase.css';
export const EquipmentCase = ({ children, title, unit, icon, tabs }) => {

  return (
      <RuxContainer className={ tabs ? 'container_equipment-case tab-case' : 'container_equipment-case'} style={{overflow: 'hidden'}}>
        <div slot="header">
          <div style={{ display: 'flex', alignItems: 'center', }}>
            {icon} {title + ` ` + unit}
          </div>
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
};
