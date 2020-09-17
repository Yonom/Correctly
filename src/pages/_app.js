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
import { GlobalNotificationsProvider } from '../components/GlobalNotifications';
import fetchGet from '../utils/fetchGet';

const App = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher: fetchGet }}>
      <IonApp>
        <Component {...pageProps} />
        <GlobalNotificationsProvider />
      </IonApp>
    </SWRConfig>
  );
};

export default App;
