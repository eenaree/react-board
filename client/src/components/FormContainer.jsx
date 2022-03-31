import React from 'react';
import { Outlet } from 'react-router-dom';
import { css } from '@emotion/react';

const FormContainer = () => {
  return (
    <div
      css={css`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #eee;
        padding: 50px;
      `}
    >
      <Outlet />
    </div>
  );
};

export default FormContainer;
