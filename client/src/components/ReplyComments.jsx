import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import CommentList from './CommentList';
import replyReducer from '../reducers/reply';
import CommentForm from './CommentForm';
import postAPI from '../lib/api/post';
import {
  ADD_REPLY,
  ADD_REPLY_FAILURE,
  ADD_REPLY_SUCCESS,
  REMOVE_REPLY,
  REMOVE_REPLY_FAILURE,
  REMOVE_REPLY_SUCCESS,
} from '../reducers/actions';

const ReplyComments = ({ deleted, commentId, replies, setReplyCount }) => {
  const [state, dispatch] = useReducer(replyReducer, {
    isLoading: false,
    isError: null,
    replies,
  });

  function addReplyComment(comment) {
    dispatch({ type: ADD_REPLY });
    postAPI
      .addReplyComment(commentId, comment)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: ADD_REPLY_SUCCESS, reply: data.comment });
          setReplyCount(prevCount => prevCount + 1);
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: ADD_REPLY_FAILURE, error: error.response.data });
      });
  }

  function removeReplyComment(id) {
    dispatch({ type: REMOVE_REPLY });
    postAPI
      .removeReplyComment(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: REMOVE_REPLY_SUCCESS,
            id,
            deletedAt: data.deletedAt,
          });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: REMOVE_REPLY_FAILURE, error: error.response.data });
      });
  }

  return (
    <div
      css={css`
        margin-left: 20px;
      `}
    >
      <CommentForm addComment={addReplyComment} deleted={deleted} />
      {state.replies.length > 0 && (
        <CommentList
          comments={state.replies}
          removeComment={removeReplyComment}
        />
      )}
    </div>
  );
};

ReplyComments.propTypes = {
  deleted: PropTypes.bool.isRequired,
  commentId: PropTypes.number.isRequired,
  replies: PropTypes.array.isRequired,
  setReplyCount: PropTypes.func.isRequired,
};

export default ReplyComments;
