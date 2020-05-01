import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Error from 'next/error';
import { confirmEmail } from '../../services/auth';

export default () => {
  const { query: { mode, oobCode }, push } = useRouter();
  const [error, setError] = useState();

  useEffect(() => {
    const applyCode = async () => {
      switch (mode) {
        case 'resetPassword':
          await push(`/auth/new-password?oobCode=${encodeURIComponent(oobCode)}`);
          break;

        case 'verifyEmail':
          try {
            await confirmEmail(oobCode);
            await push('/auth/login');
          } catch (ex) {
            setError('Unexpected error');
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
  }, [mode, oobCode, push, setError]);

  if (error) {
    return <Error statusCode={400} title={error} />;
  }
  return <>Bitte warten...</>;
};
