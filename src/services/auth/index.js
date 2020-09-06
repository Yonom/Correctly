import useSWR from 'swr';
import { authProvider } from '../../utils/config';
import * as firebaseAuth from './firebase';
import * as csvAuth from './csv';

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
