import React from 'react';
import Posts from '../components/Posts';
import PostSearch from '../components/PostSearch';

const PostList = () => {
  return (
    <div>
      <h2>자유게시판</h2>
      <Posts />
      <PostSearch />
    </div>
  );
};

export default PostList;
