import admin from 'firebase-admin';
import { firebaseConfig } from '../../utils/config';

if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}

export const firebaseAdminAuth = admin.auth();
