import { localServer } from './default';

const postAPI = {
  writePost: post => localServer.post('/posts/writePost', post),
  getPosts: page => localServer.get('/posts/getPosts', { params: { page } }),
  getPost: postId => localServer.get('/posts/getPost', { params: { postId } }),
  editPost: post => localServer.post('/posts/editPost', post),
  removePost: postId => localServer.post('/posts/removePost', { postId }),
  recommendPost: postId => localServer.post('/posts/recommendPost', { postId }),
  unrecommendPost: postId =>
    localServer.post('/posts/unrecommendPost', { postId }),

  addComment: comment => localServer.post('/posts/addComment', comment),
  removeComment: commentId =>
    localServer.post('/posts/removeComment', { commentId }),
  addReplyComment: comment =>
    localServer.post('/posts/addReplyComment', comment),
  removeReplyComment: commentId =>
    localServer.post('/posts/removeReplyComment', { commentId }),

  removeFile: fileId => localServer.post('/posts/removeFile', { fileId }),
};

export default postAPI;
