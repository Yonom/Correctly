import { initializeApp, auth } from 'firebase-admin';
import { firebaseConfig } from '../../utils/config';

initializeApp(firebaseConfig);

export const firebaseAdminAuth = auth();
