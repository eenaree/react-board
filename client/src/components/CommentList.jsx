import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import CommentBox from './CommentBox';

const CommentList = ({ comments, removeComment }) => {
  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          css={css`
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          `}
        >
          <CommentBox comment={comment} removeComment={removeComment} />
        </div>
      ))}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  removeComment: PropTypes.func.isRequired,
};

export default CommentList;
