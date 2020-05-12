import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { confirmEmail, checkCode } from '../../services/auth';
import { makeAlert } from '../../components/GlobalNotifications';

export default () => {
  const { query: { mode, oobCode }, push } = useRouter();

  useEffect(() => {
    const applyCode = async () => {
      switch (mode) {
        case 'resetPassword':
          try {
            await checkCode(oobCode);
            await push(`/auth/new-password?oobCode=${encodeURIComponent(oobCode)}`);
          } catch (ex) {
            makeAlert({ header: 'Invalid action code.' });
          }
          break;

        case 'verifyEmail':
          try {
            await confirmEmail(oobCode);
            await push('/auth/login');
          } catch (ex) {
            makeAlert({
              header: 'Unexpected error',
              message: 'Unable to process your request.',
            });
          }
          break;


        case undefined:
          break; // do nothing (see: https://github.com/zeit/next.js/issues/8259)

        default:
          await push('/');
          break;
      }
    };
    applyCode();
  }, [mode, oobCode, push]);

  return 'Bitte warten...';
};
