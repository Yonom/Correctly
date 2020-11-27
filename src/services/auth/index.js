import { mutate } from 'swr';
import { authProvider } from '../../utils/config';
import * as firebaseAuth from './firebase';
import * as csvAuth from './csv';
import fetchPost from '../../utils/fetchPost';
import fetchGet from '../../utils/fetchGet';
import { useLoadingSWR } from '../../components/GlobalNotifications';

const auth = authProvider === 'firebase' ? firebaseAuth : authProvider === 'csv' ? csvAuth : undefined;

export const getMyData = () => {
  return fetchGet('/api/auth/me');
};

export const useMyData = () => {
  return useLoadingSWR('/api/auth/me');
};

const revalidateMyData = () => {
  return mutate('/api/auth/me');
};

export const login = async (email, password) => {
  await auth.login(email, password);
  await revalidateMyData();
};

export const logout = async () => {
  await fetchPost('/api/auth/logout');
  if (authProvider === 'firebase') {
    await auth.logout();
  }
  await revalidateMyData();
};

export const {
  register,
  registerUserData,
  sendPasswordResetEmail,
  checkCode,
  confirmEmail,
  confirmPasswordReset,
  getCurrentUser,
} = auth;
