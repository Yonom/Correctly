/* eslint-disable import/no-mutable-exports */
import admin from 'firebase-admin';
import { authProvider, firebaseConfig } from '../../utils/config';
import { loadKey } from '../../utils/api/loadConfig';

/** @type {admin.auth.Auth} */
let firebaseAdminAuth;
if (authProvider === 'firebase' && !admin.apps.length) {
  const { firebaseAdmin: firebaseAdminCert } = loadKey();

  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminCert),
    databaseURL: firebaseConfig.databaseURL,
  });
  firebaseAdminAuth = admin.auth();
}

export { firebaseAdminAuth };
