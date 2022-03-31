import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import FormContainer from './components/FormContainer';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import './styles/index.css';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route element={<FormContainer />}>
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
