import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

const tableStyle = css`
  width: 100%;
  th {
    border-bottom: 2px solid #333;
  }
  tr {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  th,
  td {
    height: 50px;
  }
  td {
    text-align: center;
  }
`;

const PostsTable = ({ posts }) => {
  return (
    <table css={tableStyle}>
      <tbody>
        <tr>
          <th width="8%">번호</th>
          <th width="60%">제목</th>
          <th>작성자</th>
          <th>등록일</th>
          <th>조회수</th>
        </tr>
        {posts.length > 0 ? (
          posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <Link
                  to={`/board/post/${post.id}`}
                  state={{ from: location.pathname + location.search }}
                >
                  {post.title}
                </Link>
              </td>
              <td>{post.User.nickname}</td>
              <td>{post.createdAt}</td>
              <td>{post.views}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td></td>
            <td rowSpan="5">게시글이 존재하지 않습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

PostsTable.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default PostsTable;
