/* Antd CSS */
import 'antd/dist/antd.css';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './_app.css';

/* Fonts */
import 'typeface-roboto';

import { SWRConfig } from 'swr';
import { IonApp } from '@ionic/react';
import NoSSR from 'react-no-ssr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlobalNotificationsProvider } from '../components/GlobalNotifications';
import { GlobalLoadingProvider } from '../components/GlobalLoading';
import fetchGet from '../utils/fetchGet';
import { init } from '../services/sentry';
import { pageview } from '../utils/gtag';

init();

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <SWRConfig value={{ fetcher: fetchGet }}>
      <NoSSR>
        <IonApp>
          <Component {...pageProps} />
          <GlobalNotificationsProvider />
          <GlobalLoadingProvider />
        </IonApp>
      </NoSSR>
    </SWRConfig>
  );
};

export default App;
