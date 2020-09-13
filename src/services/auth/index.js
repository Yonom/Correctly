import useSWR from 'swr';
import { authProvider } from '../../utils/config';
import * as firebaseAuth from './firebase';
import * as csvAuth from './csv';
import fetchPost from '../../utils/fetchPost';
import { revalidateSWR } from '../../utils/fetchGet';

const auth = authProvider === 'firebase' ? firebaseAuth : authProvider === 'csv' ? csvAuth : undefined;

export const useMyData = () => {
  return useSWR('/api/auth/me');
};

const revalidateMyData = () => {
  return revalidateSWR('/api/auth/me');
};

export const login = async () => {
  await auth.login();
  revalidateMyData();
};

export const logout = async () => {
  await fetchPost('/api/auth/logout');
  if (authProvider === 'firebase') {
    await auth.logout();
  }
  revalidateMyData();
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
