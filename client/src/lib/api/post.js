import { localServer } from './default';

const postAPI = {
  writePost: post => localServer.post('/posts', post),
  getPosts: page => localServer.get('/posts', { params: { page } }),
  getPost: id => localServer.get(`/posts/${id}`),
  editPost: (id, post) => localServer.patch(`/posts/${id}`, post),
  removePost: id => localServer.delete(`/posts/${id}`),
  recommendPost: id => localServer.post(`/posts/${id}/recommend`),
  unrecommendPost: id => localServer.delete(`/posts/${id}/recommend`),
  searchPost: value =>
    localServer.get('/posts/search', {
      params: {
        page: value.page,
        search_type: value.search_type,
        keyword: value.keyword,
      },
    }),

  addComment: (id, comment) =>
    localServer.post(`/posts/${id}/comment`, { comment }),
  removeComment: id => localServer.delete(`/posts/${id}/comment`),
  addReplyComment: (id, comment) =>
    localServer.post(`/posts/comment/${id}/reply`, { comment }),
  removeReplyComment: id => localServer.delete(`/posts/comment/${id}/reply`),
  addLikeComment: id => localServer.post(`/posts/comment/${id}/like`),
  addDislikeComment: id => localServer.post(`/posts/comment/${id}/dislike`),
  removeLikeComment: id => localServer.delete(`/posts/comment/${id}/like`),
  removeDislikeComment: id =>
    localServer.delete(`/posts/comment/${id}/dislike`),

  removeFile: id => localServer.delete(`/posts/${id}/file`),
  incrementViews: id => localServer.post(`/posts/${id}/views`),
};

export default postAPI;
