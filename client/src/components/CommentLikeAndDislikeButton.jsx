import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LikeAndDislikeButton from './LikeAndDislikeButton';
import { useUserState } from '../context/UserContext';
import postAPI from '../lib/api/post';

const CommentLikeAndDislikeButton = ({ comment, deleted }) => {
  const { user } = useUserState();
  const [likeAction, setLikeAction] = useState(getInitialLikeStatus);
  const [dislikeAction, setDislikeAction] = useState(getInitialDislikeStatus);
  const [likers, setLikers] = useState(() => comment.likers.length);
  const [dislikers, setDislikers] = useState(() => comment.dislikers.length);

  function getInitialLikeStatus() {
    if (!user) return null;

    const isLiked = !!comment.likers.find(liker => liker.id === user.id);
    return isLiked ? 'liked' : null;
  }

  function getInitialDislikeStatus() {
    if (!user) return null;

    const isDisliked = !!comment.dislikers.find(
      disliker => disliker.id === user.id
    );
    return isDisliked ? 'disliked' : null;
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
      dislikeAction === 'disliked' && removeDislikeComment(comment.id);
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
    if (dislikeAction === 'disliked') {
      removeDislikeComment(comment.id);
    } else {
      likeAction === 'liked' && removeLikeComment(comment.id);
      addDislikeComment(comment.id);
    }
  };

  const addLikeComment = id => {
    postAPI
      .addLikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction('liked');
          setLikers(prev => prev + 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addDislikeComment = id => {
    postAPI
      .addDislikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setDislikeAction('disliked');
          setDislikers(prev => prev + 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const removeLikeComment = id => {
    postAPI
      .removeLikeComment(id)
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

  const removeDislikeComment = id => {
    postAPI
      .removeDislikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setDislikeAction(null);
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
      dislikeAction={dislikeAction}
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
