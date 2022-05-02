import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button } from 'antd';
import useInput from '../lib/hooks/useInput';
import postAPI from '../lib/api/post';
import { usePostDispatch, usePostState } from '../context/PostContext';
import {
  EDIT_POST,
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS,
  WRITE_POST,
  WRITE_POST_FAILURE,
  WRITE_POST_SUCCESS,
} from '../reducers/actions';
import FileUploader from '../components/FileUploader';
import AttachedFiles from '../components/AttachedFiles';

const WritePost = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { post, newPost, isError },
  } = usePostState();
  const { dispatch } = usePostDispatch();
  const initialPostInput =
    location.pathname === '/board/write'
      ? { title: '', contents: '' }
      : { title: post.title, contents: post.contents };
  const [postInput, onChangePostInput] = useInput(initialPostInput);
  const [postFiles, setPostFiles] = useState([]);

  const postTitleInputRef = useRef(null);
  const setPostTitleInputRef = useCallback(element => {
    postTitleInputRef.current = element;
  }, []);

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
      .editPost(params.id, post)
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
      return postTitleInputRef.current.focus();
    }

    const formData = new FormData();
    formData.append('title', postInput.title);
    formData.append('contents', postInput.contents);
    if (postFiles) {
      postFiles.map(file => {
        formData.append('files', file);
      });
    }

    location.pathname === '/board/write'
      ? writePost(formData)
      : editPost(formData);
  }

  useEffect(() => {
    if (newPost) {
      navigate(`/board/post/${newPost.id}`);
    }
  }, [newPost]);

  useEffect(() => {
    if (isError) {
      alert(isError.message);
    }
  }, [isError]);

  return (
    <>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <h2>글쓰기</h2>
        <input
          ref={setPostTitleInputRef}
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
        <FileUploader setFiles={setPostFiles} />
      </form>
      {location.pathname === `/board/edit/${params.id}` && (
        <AttachedFiles files={post.Files} />
      )}
    </>
  );
};

export default WritePost;
