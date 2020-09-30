import admin from 'firebase-admin';
import { authProvider, firebaseConfig } from '../../utils/config';
import { loadKey } from '../../utils/api/loadConfig';

if (authProvider === 'firebase' && !admin.apps.length) {
  const { firebaseAdmin: firebaseAdminCert } = loadKey();

  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminCert),
    databaseURL: firebaseConfig.databaseURL,
  });
}

export const firebaseAdminAuth = admin.auth();
