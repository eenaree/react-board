import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Alert, message } from 'antd';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '../components/TextField';
import userAPI from '../lib/api/user';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const userFormSchema = Yup.object({
    email: Yup.string()
      .email('이메일 주소가 유효하지 않습니다.')
      .required('필수 입력 항목입니다.'),
    password: Yup.string()
      .min(8, '최소 8자 이상이어야 합니다.')
      .required('필수 입력 항목입니다.'),
    confirm: Yup.string()
      .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.')
      .required('필수 입력 항목입니다.'),
    nickname: Yup.string()
      .min(2, '최소 2자 이상이어야 합니다.')
      .required('필수 입력 항목입니다.'),
  });
  let timer;

  async function registerUser(userInfo) {
    try {
      const { data } = await userAPI.register(userInfo);
      if (data) {
        processRegister(data.success);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      }
    }
  }

  function processRegister(result) {
    const key = 'register result';

    function processRegisterSuccess(key) {
      message.success({ content: '회원가입 성공', key });
      navigate('/');
    }

    function processRegisterFailure(key) {
      message.error({ content: '회원가입 실패', key });
    }

    message.loading({ content: '회원가입 처리 중...', key });

    if (result) {
      timer = setTimeout(processRegisterSuccess, 1000, key);
    } else {
      timer = setTimeout(processRegisterFailure, 1000, key);
    }
  }

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h2
        css={css`
          text-align: center;
          font-weight: 700;
        `}
      >
        회원가입
      </h2>
      <Formik
        initialValues={{ email: '', password: '', confirm: '', nickname: '' }}
        validationSchema={userFormSchema}
        onSubmit={(userInfo, { setSubmitting }) => {
          registerUser(userInfo);
          setSubmitting(false);
        }}
      >
        <Form
          css={css`
            min-width: 300px;
          `}
        >
          <TextField
            type="text"
            label="이메일"
            name="email"
            placeholder="ex) abc123@gmail.com"
          />
          <TextField
            type="password"
            label="비밀번호"
            name="password"
            placeholder="비밀번호를 입력하세요"
          />
          <TextField
            type="password"
            label="비밀번호 확인"
            name="confirm"
            placeholder="비밀번호를 입력하세요"
          />
          <TextField
            type="text"
            label="닉네임"
            name="nickname"
            placeholder="닉네임을 입력하세요"
          />
          <button
            type="submit"
            css={css`
              width: 100%;
              padding: 10px 20px;
              margin: 10px 0;
              background: #333;
              color: #fff;
              border-radius: 10px;
              cursor: pointer;
            `}
          >
            회원가입
          </button>
        </Form>
      </Formik>
      {errorMessage && (
        <Alert
          message={errorMessage}
          css={css`
            text-align: center;
            font-weight: 700;
            margin: 10px 0;
          `}
          type="error"
        />
      )}
      <Link
        to="/login"
        css={css`
          display: block;
          text-align: right;
        `}
      >
        이미 회원이신가요?
      </Link>
    </>
  );
};

export default RegisterForm;
