/* eslint-disable import/no-mutable-exports */
import firebase from 'firebase/app';
import 'firebase/auth';
import { authProvider, firebaseConfig } from '../utils/config';

/** @type {firebase.auth.Auth} */
let firebaseAuth;
if (typeof window !== 'undefined' && authProvider === 'firebase' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
}

export { firebaseAuth };
