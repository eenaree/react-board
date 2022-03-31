import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const wrapperStyle = {
  minWidth: '1200px',
  margin: '0 auto',
};

const AppLayout = () => {
  return (
    <div css={wrapperStyle}>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
