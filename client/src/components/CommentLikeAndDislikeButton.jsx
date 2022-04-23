import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LikeAndDislikeButton from './LikeAndDislikeButton';
import useAuth from '../context/UserContext';
import postAPI from '../lib/api/post';

const CommentLikeAndDislikeButton = ({ comment, deleted }) => {
  const { user } = useAuth();
  const [likeAction, setLikeAction] = useState(getInitialLikeStatus);
  const [likers, setLikers] = useState(() => comment.likers.length);
  const [dislikers, setDislikers] = useState(() => comment.dislikers.length);

  function getInitialLikeStatus() {
    if (!user) return null;

    const isLiked = !!comment.likers.find(liker => liker.id === user.id);
    const isDisliked = !!comment.dislikers.find(
      disliker => disliker.id === user.id
    );

    if (isLiked === isDisliked) {
      return null;
    } else if (isLiked) {
      return 'liked';
    } else if (isDisliked) {
      return 'disliked';
    }
  }

  const onClickLike = () => {
    if (deleted) {
      alert('삭제된 댓글에는 좋아요 표시가 불가능합니다.');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (likeAction === 'liked') {
      removeLikeComment(comment.id);
    } else {
      addLikeComment(comment.id);
    }
  };

  const onClickDislike = () => {
    if (deleted) {
      alert('삭제된 댓글에는 싫어요 표시가 불가능합니다.');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (likeAction === 'disliked') {
      removeDislikeComment(comment.id);
    } else {
      addDislikeComment(comment.id);
    }
  };

  const addLikeComment = commentId => {
    postAPI
      .addLikeComment(commentId)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction('liked');
          setLikers(prev => prev + 1);
          setDislikers(prev => (prev ? prev - 1 : 0));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addDislikeComment = commentId => {
    postAPI
      .addDislikeComment(commentId)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction('disliked');
          setDislikers(prev => prev + 1);
          setLikers(prev => (prev ? prev - 1 : 0));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const removeLikeComment = commentId => {
    postAPI
      .removeLikeComment(commentId)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction(null);
          setLikers(prev => prev - 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const removeDislikeComment = commentId => {
    postAPI
      .removeDislikeComment(commentId)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction(null);
          setDislikers(prev => prev - 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <LikeAndDislikeButton
      onClickLike={onClickLike}
      onClickDislike={onClickDislike}
      likeAction={likeAction}
      likers={likers}
      dislikers={dislikers}
    />
  );
};

CommentLikeAndDislikeButton.propTypes = {
  comment: PropTypes.object.isRequired,
  deleted: PropTypes.bool.isRequired,
};

export default CommentLikeAndDislikeButton;
