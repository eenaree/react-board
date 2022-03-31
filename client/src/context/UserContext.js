import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({
  user: '',
  setUser: () => {},
});

export default function () {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  function getStoragedUser() {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  }

  const [user, setUser] = useState(getStoragedUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
