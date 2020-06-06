/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { SWRConfig } from 'swr';
import NoSSR from 'react-no-ssr';
import { IonApp } from '@ionic/react';
import { GlobalNotificationsProvider } from '../components/GlobalNotifications';

// Custom CSS
import '../colors.css';

export default ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher: (...args) => fetch(...args).then((res) => res.json()) }}>
      <NoSSR>
        <IonApp>
          <Component {...pageProps} />
          <GlobalNotificationsProvider />
        </IonApp>
      </NoSSR>
    </SWRConfig>
  );
};
