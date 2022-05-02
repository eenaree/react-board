import React, { createContext, useContext, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import postReducer from '../reducers/post';

const PostStateContext = createContext();
const PostDispatchContext = createContext();

export const usePostState = () => {
  const state = useContext(PostStateContext);
  if (!state) {
    throw new Error('PostContextProvider can not found');
  }
  return state;
};

export const usePostDispatch = () => {
  const dispatch = useContext(PostDispatchContext);
  if (!dispatch) {
    throw new Error('PostContextProvider can not found');
  }
  return dispatch;
};

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
    <PostDispatchContext.Provider value={{ dispatch }}>
      <PostStateContext.Provider value={{ state, viewsRef }}>
        {children}
      </PostStateContext.Provider>
    </PostDispatchContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
