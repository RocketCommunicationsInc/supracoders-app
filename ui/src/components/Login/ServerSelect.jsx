import React, { useEffect, useState } from 'react';
import { RuxSelect, RuxOption } from '@astrouxds/react'
import { githubCheck } from '../../lib/github-check';
import { useSewApp } from '../../context/sewAppContext';

export const ServerSelect = () => {
  const [servers, setServers] = useState([]);
  const sewAppCtx = useSewApp();

  useEffect(() => {
    if (!githubCheck()) {
      const { data: _servers } = fetch('data/server');
      setServers(_servers);
    } else {
      fetch('./data/server.json').then(res =>
        res.json().then(data => {
          setServers(data);
        })
      );
    }
  }, []);

  const handleServerChange = server_id => {
    sewAppCtx.updateUser({ ...sewAppCtx.user, server_id: server_id });
  };

  return (
    <RuxSelect
      className='login-select'
      size='small'
      style={{ marginTop: 'var(--spacing-8)', }}
      name='server'
      type='string'
      label='Server'
      value={sewAppCtx.user.server_id}
      onChange={e => handleServerChange(parseInt(e.target.value))}>
      {servers?.map((x, index) => (
        <RuxOption key={index} value={x.id} label={x.name}>
          {x.name}
        </RuxOption>
      ))}
    </RuxSelect>
  );
};
