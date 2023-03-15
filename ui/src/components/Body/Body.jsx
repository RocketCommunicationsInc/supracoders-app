/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import React from 'react';
import "./body.css";

export const Body = props => {
  return <div className="body">{props.children}</div>
};
