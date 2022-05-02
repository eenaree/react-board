import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import postAPI from '../lib/api/post';
import { usePostState, usePostDispatch } from '../context/PostContext';
import { useUserState } from '../context/UserContext';
import {
  GET_POST,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
} from '../reducers/actions';
import PostAction from '../components/PostAction';
import PostRecommendation from '../components/PostRecommendation';
import PostComments from '../components/PostComments';

const ViewPost = () => {
  const params = useParams();
  const {
    state: { isLoading, isError, post },
    viewsRef,
  } = usePostState();
  const { dispatch } = usePostDispatch();
  const { user, clientRef } = useUserState();

  const confirmViewedPost = useCallback(
    postId => {
      const currentUser = (user && user.email) || clientRef.current;
      if (!currentUser) return;

      const handleViewedPost = postId => {
        viewsRef.current[postId - 1].push(currentUser);
        setTimeout(() => {
          const userIndex = viewsRef.current[postId - 1].findIndex(
            user => user === currentUser
          );
          viewsRef.current[postId - 1].splice(userIndex, 1);
        }, 1000 * 60 * 10);
      };

      const incrementViews = postId => {
        postAPI
          .incrementViews(postId)
          .then(({ data }) => {
            if (data.success) {
              handleViewedPost(postId);
            }
          })
          .catch(error => {
            console.error(error);
          });
      };

      let viewedPost = false;

      if (!viewsRef.current[postId - 1]) {
        viewsRef.current[postId - 1] = [];
      }
      viewedPost = viewsRef.current[postId - 1].includes(currentUser);

      if (!viewedPost) {
        incrementViews(postId);
      }
    },
    [user]
  );

  const getPost = useCallback(id => {
    dispatch({ type: GET_POST });
    postAPI
      .getPost(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: GET_POST_SUCCESS, post: data.post });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: GET_POST_FAILURE, error: error.response.data });
      });
  }, []);

  useEffect(() => {
    getPost(params.id);
    confirmViewedPost(params.id);
  }, [params.id, getPost, confirmViewedPost]);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>{isError.message || '에러가 발생했습니다.'}</div>;
  return (
    <>
      {post && (
        <>
          <div
            css={css`
              margin: 10px 0;
              > * {
                padding: 10px;
                margin: 0;
              }
              .title {
                font-size: 1.25rem;
              }
              .info {
                display: flex;
                justify-content: space-between;
                border-top: 2px solid #eee;
                border-bottom: 1px solid #eee;
                background-color: #fafafa;
                .post {
                  span {
                    margin-left: 10px;
                  }
                }
              }
              .contents {
                min-height: 200px;
                border-bottom: 1px solid #eee;
              }
            `}
          >
            <p className="title">
              <strong>{post.title}</strong>
            </p>
            <p className="info">
              <span>
                작성자: <strong>{post.User.nickname}</strong>
              </span>
              <span className="post">
                <span>조회수: {post.views}</span>
                <span>등록일: {post.createdAt}</span>
              </span>
            </p>
            <div className="contents">
              <p>{post.contents}</p>
              {post.Files.map(file => (
                <img
                  key={file.id}
                  src={`http://localhost:8080/${file.fileUrl}`}
                  alt="attached pic"
                  height="400"
                />
              ))}
            </div>
          </div>
          <div
            css={css`
              text-align: center;
            `}
          >
            <PostRecommendation recommenders={post.recommenders} />
          </div>
          <PostAction />
          <PostComments comments={post.Comments} />
        </>
      )}
    </>
  );
};

export default ViewPost;
