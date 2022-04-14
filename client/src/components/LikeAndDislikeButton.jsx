import { css } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from '@ant-design/icons';

const buttonStyle = css`
  cursor: pointer;
  border: none;
  padding: 0;
  margin-right: 5px;
  background: none;
  span {
    margin-left: 5px;
  }
`;

const LikeAndDislikeButton = ({
  onClickLike,
  onClickDislike,
  likeAction,
  likers,
  dislikers,
}) => {
  return (
    <>
      <button onClick={onClickLike} css={buttonStyle}>
        {likeAction === 'liked' ? <LikeFilled /> : <LikeOutlined />}
        <span>{likers}</span>
      </button>
      <button onClick={onClickDislike} css={buttonStyle}>
        {likeAction === 'disliked' ? <DislikeFilled /> : <DislikeOutlined />}
        <span>{dislikers}</span>
      </button>
    </>
  );
};

LikeAndDislikeButton.propTypes = {
  onClickLike: PropTypes.func.isRequired,
  onClickDislike: PropTypes.func.isRequired,
  likeAction: PropTypes.oneOf(['liked', 'disliked', null]).isRequired,
  likers: PropTypes.number.isRequired,
  dislikers: PropTypes.number.isRequired,
};

export default LikeAndDislikeButton;