import dataUriToBuffer from 'data-uri-to-buffer';

export const fromBase64 = (base64) => {
  if (base64 == null) return base64;
  return dataUriToBuffer(base64);
};
