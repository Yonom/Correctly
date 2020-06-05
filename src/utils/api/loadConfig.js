import fs from 'fs';
import keyJSONFilepathOrContents from '../../../.keys/key.json';
import usersCSVFilepathOrContents from '../../../.keys/users.csv';
import superusersTXTFilepathOrContents from '../../../.keys/superusers.txt';

const isVercel = !!process.env.VERCEL_URL;
export const loadKey = () => {
  if (isVercel) return keyJSONFilepathOrContents;
  return JSON.parse(fs.readFileSync(keyJSONFilepathOrContents, 'utf8'));
};

export const loadCSVUsers = () => {
  if (isVercel) return usersCSVFilepathOrContents;
  return fs.readFileSync(usersCSVFilepathOrContents, 'utf8');
};

export const loadSuperusers = () => {
  if (isVercel) return superusersTXTFilepathOrContents;
  return fs.readFileSync(superusersTXTFilepathOrContents, 'utf8');
};
