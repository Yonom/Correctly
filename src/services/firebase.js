import { initializeApp, apps, auth } from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '../utils/config';

if (typeof window !== 'undefined' && !apps.length) {
  initializeApp(firebaseConfig);
}

export const firebaseAuth = auth();
