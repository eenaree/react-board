import React, { createContext, useContext, useReducer, useRef } from 'react';
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
  const viewsRef = useRef([]);

  return (
    <PostContext.Provider value={{ postState: state, dispatch, viewsRef }}>
      {children}
    </PostContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
