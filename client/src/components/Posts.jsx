import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button, Pagination } from 'antd';
import usePost from '../context/PostContext';
import postAPI from '../lib/api/post';
import {
  GET_POSTS,
  GET_POSTS_FAILURE,
  GET_POSTS_SUCCESS,
  SEARCH_POST,
  SEARCH_POST_FAILURE,
  SEARCH_POST_SUCCESS,
} from '../reducers/actions';
import PostsTable from './PostsTable';

const Posts = () => {
  const navigate = useNavigate();
  const {
    postState: { isLoading, isError, count },
    dispatch,
  } = usePost();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => parseInt(searchParams.get('page')));

  const onChangePage = page => {
    const currentParams = Object.fromEntries([...searchParams]);
    setPage(page);
    setSearchParams({ ...currentParams, page });
  };

  const onClickWrite = () => {
    navigate('/board/write');
  };

  const searchPost = useCallback(value => {
    dispatch({ type: SEARCH_POST });
    postAPI
      .searchPost(value)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: SEARCH_POST_SUCCESS,
            posts: data.posts,
            count: data.count,
          });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: SEARCH_POST_FAILURE, error: error.response.data });
      });
  }, []);

  const getPosts = useCallback(page => {
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
  }, []);

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    if (currentParams.keyword === undefined) {
      getPosts(currentParams.page);
    } else {
      if (currentParams.page == 1) {
        setPage(1);
      }
      searchPost(currentParams);
    }
  }, [searchParams, getPosts, searchPost]);

  if (isLoading) return <div>로딩 중....</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  return (
    <>
      <PostsTable />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        `}
      >
        <Pagination total={count} current={page} onChange={onChangePage} />
        <Button onClick={onClickWrite}>글쓰기</Button>
      </div>
    </>
  );
};

export default Posts;
