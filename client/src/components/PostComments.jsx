import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import commentReducer from '../reducers/comment';
import {
  ADD_COMMENT,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
} from '../reducers/actions';
import postAPI from '../lib/api/post';

const PostComments = ({ comments }) => {
  const params = useParams();
  const [state, dispatch] = useReducer(commentReducer, {
    isLoading: false,
    isError: null,
    comments,
  });

  function addComment(comment) {
    dispatch({ type: ADD_COMMENT });
    postAPI
      .addComment({ postId: params.id, comment })
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: ADD_COMMENT_SUCCESS, comment: data.comment });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: ADD_COMMENT_FAILURE, error: error.response.data });
      });
  }

  function removeComment(id) {
    dispatch({ type: REMOVE_COMMENT });
    postAPI
      .removeComment(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: REMOVE_COMMENT_SUCCESS,
            id,
            deletedAt: data.deletedAt,
          });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: REMOVE_COMMENT_FAILURE, error: error.response.data });
      });
  }

  return (
    <div>
      <p
        css={css`
          margin: 20px 0 10px;
        `}
      >
        댓글 <strong>{state.comments.length}</strong>
      </p>
      <CommentForm addComment={addComment} />
      {state.comments.length > 0 && (
        <CommentList comments={state.comments} removeComment={removeComment} />
      )}
    </div>
  );
};

PostComments.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default PostComments;
