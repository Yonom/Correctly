import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { confirmEmail, checkCode } from '../../services/auth';
import { makeAPIErrorAlert } from '../../utils/errors';

const Action = () => {
  const { query: { mode, oobCode }, push } = useRouter();

  useEffect(() => {
    const applyCode = async () => {
      switch (mode) {
        case 'resetPassword':
          try {
            await checkCode(oobCode);
            await push(`/auth/new-password?oobCode=${encodeURIComponent(oobCode)}`);
          } catch (ex) {
            makeAPIErrorAlert(ex);
          }
          break;

        case 'verifyEmail':
          try {
            await confirmEmail(oobCode);
            await push('/auth/login');
          } catch (ex) {
            makeAPIErrorAlert(ex);
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

  return 'Please wait...';
};

export default Action;
