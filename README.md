# React Board

React, React Hook, React Router를 사용해서 만든 간단한 게시판입니다.  
express, sequelize ORM을 사용하여 CRUD 기능을 가진 로컬 서버를 생성했습니다.

## 구현 기능

- 회원가입 및 로그인
  - Formik, Yup 라이브러리 사용: 입력 폼 유효성 검사
  - sessionStorage 사용: 새로고침시, 로그인 유지 목적
- 포스트 작성, 수정, 삭제 + 파일 업로드
  - 포스트 데이터 관리: PostContext 사용
  - 파일 업로드: 포스트 작성시, 파일 타입 유효성 검사를 통과한 파일만 포스트 작성 페이지에서 렌더링
- 포스트 추천
- 포스트 조회수 올리기
  - 조회 리스트에서 사용자 정보를 조회한 후, 일치하는 사용자 정보가 없다면 조회수 증가 API를 호출하고, 10분 뒤 사용자 정보를 삭제하는 방식
  - 현재 로그인 사용자가 없을 경우를 대비해, ip주소 데이터 활용
- 포스트 검색
  - setSearchParams, useEffect hook 사용
  - 검색시 setSearchParams로 searhParams 변경값 전달
    effect 함수에 searchParams가 변경될 때, searchParams 객체 값을 검색 API에 전달 후 호출하는 방식
- 댓글 및 대댓글 추가, 제거
  - PostContext value에서 전달한 post 데이터에서 파생된 comment 값 사용
  - CommentForm, CommentList, CommentBox 컴포넌트 재사용하여 코드 구조 반복
  - props.comment replies 프로퍼티가 존재할 때만, 답글 버튼 생성
- 댓글 좋아요, 싫어요
