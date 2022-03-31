import { localServer } from './default';

const userAPI = {
  register: userInfo => localServer.post('/users/register', userInfo),
  login: userInfo => localServer.post('/users/login', userInfo),
  logout: () => localServer.get('/users/logout'),
};

export default userAPI;
