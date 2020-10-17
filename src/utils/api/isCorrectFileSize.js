import { APIError } from '../fetchPost';

export const isCorrectFileSize = (file) => {
  return !file || file.length <= 50 * 1000000 * (4 / 3);
};

export const verifyFileSize = (file) => {
  if (!isCorrectFileSize(file)) throw new APIError({ code: 'upload/max-limit' });
};

export const isCorrectFileNameSize = (name) => {
  return !name || name.length <= 500;
};

export const verifyFileNameSize = (file) => {
  if (!isCorrectFileNameSize(file)) throw new APIError({ code: 'upload/max-name-limit' });
};
