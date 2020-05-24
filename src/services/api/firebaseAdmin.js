import admin from 'firebase-admin';
import { firebaseConfig } from '../../utils/config';
import { firebaseAdmin as firebaseAdminCert } from '../../../.keys/key.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminCert),
    databaseURL: firebaseConfig.databaseURL,
  });
}

export const firebaseAdminAuth = admin.auth();
