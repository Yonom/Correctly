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
import { IonApp } from '@ionic/react';
import { GlobalNotificationsProvider } from '../components/GlobalNotifications';

const fetcher = (...args) => fetch(...args).then((res) => {
  if (!res.ok) throw res;
  return res.json();
});

const App = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher }}>
      <IonApp>
        <Component {...pageProps} />
        <GlobalNotificationsProvider />
      </IonApp>
    </SWRConfig>
  );
};

export default App;
