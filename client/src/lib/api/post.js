import { localServer } from './default';

const postAPI = {
  writePost: post => localServer.post('/posts/writePost', post),
  getPosts: page => localServer.get('/posts/getPosts', { params: { page } }),
  getPost: postId => localServer.get('/posts/getPost', { params: { postId } }),
  editPost: post => localServer.post('/posts/editPost', post),
  removePost: postId => localServer.post('/posts/removePost', { postId }),
};

export default postAPI;
