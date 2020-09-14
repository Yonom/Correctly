import admin from 'firebase-admin';
import { firebaseConfig } from '../../utils/config';
import { loadKey } from '../../utils/api/loadConfig';

if (!admin.apps.length) {
  const { firebaseAdmin: firebaseAdminCert } = loadKey();

  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminCert),
    databaseURL: firebaseConfig.databaseURL,
  });
}

export const firebaseAdminAuth = admin.auth();
