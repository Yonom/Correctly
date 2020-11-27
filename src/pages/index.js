import Router from 'next/router';
import { useEffect } from 'react';
import AppPage from '../components/AppPage';
import { withLoading } from '../components/GlobalLoading';
import { getMyData } from '../services/auth';

const RootPage = () => {
  useEffect(() => {
    const redirect = withLoading(async () => {
      const { loggedIn } = await getMyData();
      Router.replace(
        loggedIn ? '/home' : '/auth/login',
      );
    });
    redirect();
  }, []);

  return (
    <AppPage />
  );
};

export default RootPage;
