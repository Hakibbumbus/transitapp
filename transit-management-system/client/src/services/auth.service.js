import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};