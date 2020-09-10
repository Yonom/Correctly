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

export const {
  login,
  register,
  registerUserData,
  sendPasswordResetEmail,
  checkCode,
  confirmEmail,
  confirmPasswordReset,
  getCurrentUser,
} = auth;

export const deleteUser = async (userId) => {
  const res = await fetchPost('/api/auth/superuser/deleteUser', { userId });
  revalidateSWR('/api/users/allUsers');
  return res;
};

export const changeUser = async (userId, firstName, lastName, email, studentId) => {
  const res = await fetchPost('/api/auth/superuser/changeUser', { userId, firstName, lastName, email, studentId });
  revalidateSWR('/api/users/allUsers');
  return res;
};
