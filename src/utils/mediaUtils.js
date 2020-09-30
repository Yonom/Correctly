import { useMediaQuery } from '@react-hook/media-query';

export const useLgOrUp = () => {
  return useMediaQuery('(min-width: 992px)');
};
