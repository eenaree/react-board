import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import postAPI from '../lib/api/post';
import fileReducer from '../reducers/file';
import {
  REMOVE_FILE,
  REMOVE_FILE_FAILURE,
  REMOVE_FILE_SUCCESS,
} from '../reducers/actions';

const AttachedFiles = ({ files }) => {
  const [state, dispatch] = useReducer(fileReducer, {
    isLoading: false,
    isError: null,
    files,
  });

  const onClickDelete = id => {
    if (window.confirm('첨부된 파일을 삭제하시겠습니까?')) {
      removeFile(id);
    }
  };

  const removeFile = id => {
    dispatch({ type: REMOVE_FILE });
    postAPI
      .removeFile(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: REMOVE_FILE_SUCCESS, id });
        }
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: REMOVE_FILE_FAILURE, error: error.response.data });
      });
  };

  return (
    <div>
      <p>
        <strong>첨부된 파일 {state.files.length}</strong>
      </p>
      {state.files.map(file => (
        <div
          key={file.id}
          css={css`
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #eee;
            height: 50px;
            &:hover {
              background-color: #eee;
            }
          `}
        >
          <div>
            <img
              src={`http://localhost:8080/${file.fileUrl}`}
              alt="attached file preivew"
              css={css`
                margin-right: 10px;
                width: 100px;
                height: 100%;
              `}
            />
            <span>{file.fileUrl.slice(8)}</span>
          </div>
          <button
            onClick={() => onClickDelete(file.id)}
            css={css`
              cursor: pointer;
              border: none;
            `}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

AttachedFiles.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fileUrl: PropTypes.string.isRequired,
      PostId: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AttachedFiles;
