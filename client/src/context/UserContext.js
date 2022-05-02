import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const UserStateContext = createContext({
  user: '',
});

const UserUpdaterContext = createContext({
  setUser: () => {},
});

export const useUserState = () => {
  const state = useContext(UserStateContext);
  if (!state) {
    throw new Error('UserContextProvider can not found');
  }
  return useContext(UserStateContext);
};

export const useUserUpdater = () => {
  const updater = useContext(UserUpdaterContext);
  if (!updater) {
    throw new Error('UserContextProvider can not found');
  }
  return updater;
};

const getStoragedUser = () => {
  return JSON.parse(sessionStorage.getItem('user')) || null;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getStoragedUser);
  const clientRef = useRef();

  const getClientIp = () => {
    axios
      .get('https://api.ipify.org?format=json')
      .then(({ data }) => {
        clientRef.current = data.ip;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!user) {
      getClientIp();
    }
  }, [user]);

  return (
    <UserUpdaterContext.Provider value={{ setUser }}>
      <UserStateContext.Provider value={{ user, clientRef }}>
        {children}
      </UserStateContext.Provider>
    </UserUpdaterContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
