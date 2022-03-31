import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button, Col, Menu, Row } from 'antd';
import useAuth from '../context/UserContext';
import userAPI from '../lib/api/user';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  async function logoutUser() {
    try {
      const { data } = await userAPI.logout();
      if (data.success) {
        navigate('/');
        sessionStorage.removeItem('user');
        setUser('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onClickLogout() {
    logoutUser();
  }

  return (
    <header>
      <Row>
        <Col span={6}>
          <h1
            css={css`
              text-align: center;
            `}
          >
            <Link
              to="/"
              css={css`
                color: #333;
                font-size: 20px;
              `}
            >
              React Board
            </Link>
          </h1>
        </Col>
        <Col span={12}>
          <Menu mode="horizontal">
            <Menu.Item key="all">
              <Link to="/board">자유게시판</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={6}>
          {user ? (
            <div
              css={css`
                margin-top: 10px;
              `}
            >
              <span
                css={css`
                  margin-right: 10px;
                `}
              >
                {user.nickname}님
              </span>
              <Button onClick={onClickLogout}>로그아웃</Button>
            </div>
          ) : (
            <Menu mode="horizontal">
              <Menu.Item key="login">
                <Link
                  to="/login"
                  state={{ from: location.pathname + location.search }}
                >
                  로그인
                </Link>
              </Menu.Item>
              <Menu.Item key="register">
                <Link to="/register">회원가입</Link>
              </Menu.Item>
            </Menu>
          )}
        </Col>
      </Row>
    </header>
  );
};

export default Header;
