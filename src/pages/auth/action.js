import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { confirmEmail } from '../../services/auth';

export default () => {
  const { query: { mode, oobCode }, push } = useRouter();

  useEffect(() => {
    const applyCode = async () => {
      switch (mode) {
        case 'resetPassword':
          await push(`/auth/resetPassword?oobCode=${encodeURIComponent(oobCode)}`);
          break;

        case 'verifyEmail':
          try {
            await confirmEmail(oobCode);
            await push('/auth/login');
          } catch (ex) {
            await push(`/error?statusCode=400&title=${encodeURIComponent('Unexpected error')}`);
          }
          break;

        default:
          await push('/');
          break;
      }
    };
    applyCode();
  }, [mode, oobCode, push]);

  return <>Bitte warten...</>;
};
