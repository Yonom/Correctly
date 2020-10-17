import dataUriToBuffer from 'data-uri-to-buffer';

export const fromBase64 = (base64) => {
  if (!base64) return undefined;
  return dataUriToBuffer(base64);
};
