import { authProvider } from '../../utils/config';
import * as firebaseAuth from './firebase';
import * as csvAuth from './csv';

const auth = authProvider === 'firebase' ? firebaseAuth : authProvider === 'csv' ? csvAuth : undefined;

export const {
  login,
  register,
  sendVerificationEmail,
  sendPasswordResetEmail,
  confirmEmail,
  confirmPasswordReset,
} = auth;
