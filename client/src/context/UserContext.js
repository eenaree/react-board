import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    <UserContext.Provider value={{ user, setUser, clientRef }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
