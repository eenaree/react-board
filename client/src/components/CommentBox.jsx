import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'antd';
import { css } from '@emotion/react';
import useAuth from '../context/UserContext';
import ReplyComments from './ReplyComments';
import CommentLikeAndDislikeButton from './CommentLikeAndDislikeButton';

const CommentBox = ({ comment, removeComment }) => {
  const { user } = useAuth();
  const [openReply, setOpenReply] = useState(false);
  const [replyCount, setReplyCount] = useState(
    comment.replies && comment.replies.length
  );

  function toggleReply() {
    setOpenReply(prevState => !prevState);
  }

  function deleteComment(id) {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      removeComment(id);
    }
  }

  return (
    <>
      <Comment
        author={comment.User.nickname}
        content={
          comment.deletedAt
            ? '작성자에 의해 삭제된 메세지입니다.'
            : comment.comment
        }
        datetime={comment.createdAt}
        actions={[
          comment.replies && (
            <button
              onClick={toggleReply}
              css={css`
                cursor: pointer;
                background: none;
                border: none;
                color: #1890ff;
              `}
            >
              답글 {replyCount > 0 && <strong>{replyCount}</strong>}
            </button>
          ),
          <CommentLikeAndDislikeButton
            key="comment-like-status"
            comment={comment}
            deleted={!!comment.deletedAt}
          />,
        ]}
        css={css`
          position: relative;
        `}
      >
        {!comment.deletedAt && user && user.id === comment.User.id && (
          <button
            onClick={() => deleteComment(comment.id)}
            css={css`
              position: absolute;
              top: 16px;
              right: 0;
              cursor: pointer;
              border: none;
            `}
          >
            삭제
          </button>
        )}
      </Comment>
      {openReply && (
        <ReplyComments
          deleted={!!comment.deletedAt}
          commentId={comment.id}
          replies={comment.replies}
          setReplyCount={setReplyCount}
        />
      )}
    </>
  );
};

CommentBox.propTypes = {
  comment: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
};

export default CommentBox;
