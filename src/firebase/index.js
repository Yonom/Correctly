import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '../clientConfig';

if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;