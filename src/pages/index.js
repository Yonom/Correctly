import Router from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    Router.push('/auth/login');
  }, []);
  return <></>;
};

export default Index;
