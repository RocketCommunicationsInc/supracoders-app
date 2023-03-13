import React from 'react';
import { RuxCard, } from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './equipmentCase.css';
export const EquipmentCase = ({ children, title, unit, icon, tabs }) => {

  return (
      <RuxCard className={ tabs ? 'container_equipment-case tab-case' : 'container_equipment-case'} style={{overflow: 'hidden'}}>
        <div slot="header">
          <div style={{ display: 'flex', alignItems: 'center', }}>
            {title + ` ` + unit} {icon}
          </div>
          { tabs ? <div className="tabs">{tabs}</div> : null}
        </div>
        <Grid container>
          <Grid item xs={true}>
            {children}
          </Grid>
        </Grid>
      </RuxCard>
  );
};

EquipmentCase.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  unit: PropTypes.number.isRequired,
  icon: PropTypes.node,
  tabs: PropTypes.node,
};
