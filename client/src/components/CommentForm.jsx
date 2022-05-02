import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { useUserState } from '../context/UserContext';

const CommentForm = ({ addComment, deleted }) => {
  const { user } = useUserState();
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
        placeholder={
          deleted
            ? '댓글 등록이 불가합니다'
            : user
            ? '댓글을 입력하세요'
            : '로그인이 필요합니다'
        }
        disabled={deleted || !user}
      />
      <button
        css={css`
          width: 100%;
          border: none;
          background-color: #f1f1f1;
          padding: 5px 0;
          cursor: pointer;
          &:disabled {
            background-color: #f8f8f8;
            cursor: auto;
          }
        `}
        disabled={deleted || !user}
      >
        등록
      </button>
    </form>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  deleted: PropTypes.bool,
};

export default CommentForm;
