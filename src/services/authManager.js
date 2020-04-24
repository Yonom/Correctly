import { authProvider } from '../clientConfig';
import * as firebaseAuth from './firebase/auth';
import * as csvAuth from './csvAuth';

const auth = authProvider === 'firebase' ? firebaseAuth : authProvider === 'csv' ? csvAuth : undefined;

export const {
  login,
  register,
  sendVerificationEmail,
  sendPasswordResetEmail,
  confirmEmail,
  confirmPasswordReset,
} = auth;
