/* eslint-disable import/no-mutable-exports */
import { initializeApp, apps, auth } from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '../utils/config';

let firebaseAuth;
if (typeof window !== 'undefined' && !apps.length) {
  initializeApp(firebaseConfig);
  firebaseAuth = auth();
}

export { firebaseAuth };
