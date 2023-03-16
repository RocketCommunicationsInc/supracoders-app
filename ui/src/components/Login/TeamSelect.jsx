import React from 'react';
import { RuxSelect, RuxOption } from '@astrouxds/react'
import { teams } from '../../constants';
import { useSewApp } from '../../context/sewAppContext';

export const TeamSelect = () => {
  const sewAppCtx = useSewApp();

  const handleTeamChange = value => {
    sewAppCtx.updateUser({ ...sewAppCtx.user, team_id: value });
  };

  return (
    <RuxSelect
      className='login-select'
      size='small'
      name='team'
      type='string'
      label='Team'
      value={teams[sewAppCtx.user.team_id - 1].id}
      onChange={e => handleTeamChange(parseInt(e.target.value))}>
      {teams.map((x, index) => (
        <RuxOption key={index} value={x.id} label={x.name}>
          {x.name}
        </RuxOption>
      ))}
    </RuxSelect>
  );
};
