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

/* Fonts */
import 'typeface-roboto';

import { SWRConfig } from 'swr';
import { IonApp } from '@ionic/react';
import { GlobalNotificationsProvider } from '../components/GlobalNotifications';

const fetcher = (...args) => fetch(...args).then(async (res) => {
  if (!res.ok) throw await res.json();
  return await res.json();
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
