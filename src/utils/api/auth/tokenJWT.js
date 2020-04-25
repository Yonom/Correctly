
import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from 'firebase-admin';
import { jwt as jwtKey } from '../../../../.keys/key.json';

import { firebaseConfig } from '../../../clientConfig';

const TOKEN_EXPIRY = '1h';

const auth = firebaseAuth(firebaseConfig.appId);

export const verifyFirebaseToken = (token) => {
  return auth.verifyIdToken(token);
};

export const generateToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ sub: userId }, jwtKey.secret, { expiresIn: TOKEN_EXPIRY }, (err, encoded) => {
      if (err) reject(err);
      else resolve(encoded);
    });
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey.secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};
