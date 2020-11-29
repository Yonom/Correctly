import { APIError } from '../fetchPost';

const isCorrectFileSize = (file) => {
  return !file || file.length <= 50 * 1000000 * (4 / 3);
};

export const verifyFileSize = (file) => {
  if (!isCorrectFileSize(file)) throw new APIError({ code: 'upload/max-limit' });
};

const isCorrectFileNameSize = (name) => {
  return !name || name.length <= 500;
};

export const verifyFileNameSize = (file) => {
  if (!isCorrectFileNameSize(file)) throw new APIError({ code: 'upload/max-name-limit' });
};

const isCorrectFileFormat = (name, allowedFormats) => {
  return !name || allowedFormats.some((format) => name.endsWith(format));
};

export const verifyFileNameAllowedFormats = (name, allowedFormats) => {
  if (!isCorrectFileFormat(name, allowedFormats)) throw new APIError({ code: 'upload/bad-file-format' });
};
