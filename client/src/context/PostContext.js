import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import postReducer from '../reducers/post';

const PostContext = createContext();

export default function () {
  return useContext(PostContext);
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, {
    isLoading: false,
    isError: null,
    count: 0,
    posts: [],
    post: null,
    newPost: null,
  });

  return (
    <PostContext.Provider value={{ postState: state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
