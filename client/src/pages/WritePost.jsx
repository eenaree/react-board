import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button } from 'antd';
import useInput from '../lib/hooks/useInput';
import postAPI from '../lib/api/post';
import usePost from '../context/PostContext';
import {
  EDIT_POST,
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS,
  WRITE_POST,
  WRITE_POST_FAILURE,
  WRITE_POST_SUCCESS,
} from '../reducers/actions';

const WritePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postState, dispatch } = usePost();
  const initialPostInput =
    location.pathname === '/board/write'
      ? { title: '', contents: '' }
      : { title: postState.post.title, contents: postState.post.contents };
  const [postInput, onChangePostInput] = useInput(initialPostInput);
  const inputRef = useRef();

  function onClickGoBack() {
    navigate(-1);
  }

  function writePost(post) {
    dispatch({ type: WRITE_POST });
    postAPI
      .writePost(post)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: WRITE_POST_SUCCESS, post: data.post });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: WRITE_POST_FAILURE, error: error.response.data });
      });
  }

  function editPost(post) {
    dispatch({ type: EDIT_POST });
    postAPI
      .editPost(post)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: EDIT_POST_SUCCESS, post: data.post });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: EDIT_POST_FAILURE, error: error.response.data });
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!postInput.title) {
      alert('제목을 입력하세요');
      return inputRef.current.focus();
    }

    location.pathname === '/board/write'
      ? writePost(postInput)
      : editPost({ postId: postState.post.id, ...postInput });
  }

  useEffect(() => {
    if (postState.newPost) {
      navigate(`/board/post/${postState.newPost.id}`);
    }
  }, [postState.newPost]);

  return (
    <form onSubmit={onSubmit}>
      <h2>글쓰기</h2>
      <input
        type="text"
        name="title"
        css={css`
          width: 100%;
          border: 1px solid #eee;
          margin: 10px 0;
          padding: 10px;
        `}
        value={postInput.title}
        onChange={onChangePostInput}
        placeholder="제목"
      />
      <textarea
        name="contents"
        id="contents"
        css={css`
          min-height: 200px;
          width: 100%;
          resize: none;
          border: 1px solid #eee;
          padding: 10px;
        `}
        value={postInput.contents}
        onChange={onChangePostInput}
        placeholder="내용을 입력하세요"
      />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <Button onClick={onClickGoBack}>이전</Button>
        <Button htmlType="submit">작성</Button>
      </div>
    </form>
  );
};

export default WritePost;
