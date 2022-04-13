import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import useAuth from '../context/UserContext';

const CommentForm = ({ addComment }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const onChangeComment = e => setComment(e.target.value);

  function onSubmit(e) {
    e.preventDefault();
    if (!comment) {
      return alert('작성된 내용이 없습니다.');
    }
    addComment(comment);
    setComment('');
  }

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="comment"
        id="comment"
        value={comment}
        onChange={onChangeComment}
        css={css`
          resize: none;
          width: 100%;
          border: 1px solid #ddd;
        `}
        placeholder={user ? '댓글을 입력하세요' : '로그인이 필요합니다'}
        disabled={!user}
      />
      <button
        css={css`
          width: 100%;
          border: none;
          background-color: #f1f1f1;
          padding: 5px 0;
          cursor: pointer;
        `}
      >
        등록
      </button>
    </form>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default CommentForm;
