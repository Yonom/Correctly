import { IonLoading } from '@ionic/react';
import Router from 'next/router';
import { useEffect } from 'react';
import AppPage from '../components/AppPage';
import { getMyData } from '../services/auth';

const Index = () => {
  useEffect(() => {
    const redirect = async () => {
      const { loggedIn } = await getMyData();
      Router.replace(
        loggedIn ? '/home' : '/auth/login',
      );
    };
    redirect();
  }, []);

  return (
    <AppPage>
      <IonLoading />
    </AppPage>
  );
};

export default Index;
