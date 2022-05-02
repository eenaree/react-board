import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserState } from '../context/UserContext';

const Authentication = ({ children }) => {
  const { user } = useUserState();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
};

Authentication.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Authentication;
