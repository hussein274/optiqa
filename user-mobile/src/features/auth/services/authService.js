
import api from '../../../services/api';

const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data;
};

const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);

  return response.data;
};

const getUserProfile = async () => {
  const response = await api.get('/users/profile');

  return response.data.user;
};

const authService = {
  loginUser,
  registerUser,
  getUserProfile,
};

export default authService;
