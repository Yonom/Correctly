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

export const isCorrectFileFormat = (file, allowedFormats) => {
  return allowedFormats.some((format) => file.endsWith(format));
};

export const verifyFileNameAllowedFormats = (file, allowedFormats) => {
  if (!isCorrectFileFormat(file, allowedFormats)) throw new APIError({ code: 'upload/bad-file-format' });
};
