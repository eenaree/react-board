import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Input } from 'antd';

const PostSearch = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('all');
  const [keyword, setKeyword] = useState('');
  let searchInput = null;

  const onChangeSearchType = value => setSearchType(value);
  const onChangeKeyword = e => setKeyword(e.target.value);

  const searchInputRef = useRef(null);
  const setSearchInputRef = useCallback(element => {
    searchInputRef.current = element;
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    if (!keyword) {
      alert('검색어를 입력하세요');
      return searchInput.focus();
    }

    navigate({
      pathname: '/board/posts',
      search: `?page=1&search_type=${searchType}&keyword=${keyword}`,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Select defaultValue="all" onChange={onChangeSearchType}>
        <Select.Option value="all">전체</Select.Option>
        <Select.Option value="title">제목</Select.Option>
        <Select.Option value="contents">내용</Select.Option>
        <Select.Option value="writer">작성자</Select.Option>
      </Select>
      <Input
        ref={setSearchInputRef}
        value={keyword}
        onChange={onChangeKeyword}
        style={{ width: '30%' }}
      />
      <Button htmlType="submit">검색</Button>
    </form>
  );
};

export default PostSearch;
