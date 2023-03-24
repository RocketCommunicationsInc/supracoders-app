import React from 'react';
import { RuxButton } from '@astrouxds/react'

export const JoinButton = () => (
    <RuxButton type='submit' size='small' style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-8)' }}>
        Sign in
    </RuxButton>
);
