import React from 'react';
import { RuxContainer, RuxPopUp, RuxIcon} from '@astrouxds/react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import './equipmentCase.css';

export const EquipmentCase2 = ({ children, title, unit, units, icon, tabs, setModalState }) => {

const DropDownSelect = () => {
    return(
          <>
            <RuxPopUp disableAutoUpdate placement="bottom">
              <div slot='trigger' style={{ display: 'flex', paddingRight: 'var(--spacing-3)' }}>
                <RuxIcon icon={'arrow-drop-down'} size='24px' style={{paddingLeft: 'var(--spacing-1)'}} />
              </div>
                {units}
            </RuxPopUp>
          </>
      )}

  return (
    <RuxContainer style={{overflow: 'hidden'}} className="equip-case">
    <div slot="header" style={{display: 'flex', justifyContent: 'space-between'}}>
      <div className="grid-header" style={{ display: 'flex', alignItems: 'center'}}>
        {icon} {title + ` ` + unit}
        <DropDownSelect />
      </div>
        <RuxIcon icon='help'
        size='24px'
        className='helpIcon'
        style={{ paddingLeft: '8px' }}
          onClick={() => {
            setModalState(true);
          }} />
    </div>
    {tabs ? <div slot="tab-bar">{tabs}</div> : null}
        <Grid container height={'100%'}>
            {children}
        </Grid>
      </RuxContainer>
  );
};

EquipmentCase2.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  unit: PropTypes.number.isRequired,
  units: PropTypes.node,
  icon: PropTypes.node,
  tabs: PropTypes.node,
  setModalState: PropTypes.func,
};
