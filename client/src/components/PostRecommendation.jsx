import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import useAuth from '../context/UserContext';
import postAPI from '../lib/api/post';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';

const PostRecommendation = ({ recommenders }) => {
  const params = useParams();
  const { user } = useAuth();
  const [isRecommended, setIsRecommended] = useState(getRecommendedStatus);
  const [recommendationCount, setRecommendationCount] = useState(
    recommenders.length
  );

  function getRecommendedStatus() {
    return user
      ? !!recommenders.find(recommender => recommender.id === user.id)
      : false;
  }

  function recommendPost(id) {
    postAPI
      .recommendPost(id)
      .then(({ data }) => {
        if (data.success) {
          setRecommendationCount(prevCount => prevCount + 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  function unrecommendPost(id) {
    postAPI
      .unrecommendPost(id)
      .then(({ data }) => {
        if (data.success) {
          setRecommendationCount(prevCount => prevCount - 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  function toggleRecommendation() {
    if (!user) {
      return alert('로그인이 필요합니다.');
    }
    setIsRecommended(prevState => !prevState);
    isRecommended ? unrecommendPost(params.id) : recommendPost(params.id);
  }

  return (
    <Button
      onClick={toggleRecommendation}
      css={
        isRecommended &&
        css`
          border-color: #1890ff;
          color: #1890ff;
        `
      }
    >
      추천 {recommendationCount}
    </Button>
  );
};

PostRecommendation.propTypes = {
  recommenders: PropTypes.array.isRequired,
};

export default PostRecommendation;
