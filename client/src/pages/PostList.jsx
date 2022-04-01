import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Pagination } from 'antd';
import PostsTable from '../components/PostsTable';
import postAPI from '../lib/api/post';
import usePost from '../context/PostContext';
import {
  GET_POSTS,
  GET_POSTS_FAILURE,
  GET_POSTS_SUCCESS,
} from '../reducers/actions';
import { css } from '@emotion/react';

const PostList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const getCurrentPage = () => searchParams.get('page');
  const [page, setPage] = useState(getCurrentPage);
  const {
    postState: { isLoading, isError, posts, count },
    dispatch,
  } = usePost();
  const [totalPost, setTotalPost] = useState(0);

  function onClickWrite() {
    navigate('/board/write');
  }

  function onChangePage(page) {
    setPage(page);
    setSearchParams({ page });
  }

  useEffect(() => {
    function getPosts(page) {
      dispatch({ type: GET_POSTS });
      postAPI
        .getPosts(page)
        .then(({ data }) => {
          if (data.success) {
            dispatch({
              type: GET_POSTS_SUCCESS,
              posts: data.posts,
              count: data.count,
            });
          }
        })
        .catch(error => {
          console.error(error);
          dispatch({ type: GET_POSTS_FAILURE, error: error.response.data });
        });
    }
    getPosts(page);
  }, [page]);

  useEffect(() => {
    if (posts.length > 0) {
      setTotalPost(count);
    }
  }, [posts, count]);

  if (isLoading) return <div>로딩 중....</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  return (
    <div>
      <h2>자유게시판</h2>
      <PostsTable posts={posts} />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        `}
      >
        <Pagination total={totalPost} current={page} onChange={onChangePage} />
        <Button onClick={onClickWrite}>글쓰기</Button>
      </div>
    </div>
  );
};

export default PostList;
