
import jwt from 'jsonwebtoken';
import { jwt as jwtKey } from '../../../../.keys/key.json';

const TOKEN_EXPIRY = '1h';

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
