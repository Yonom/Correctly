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

import Head from 'next/head';
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
      <Head>
        <meta name="application-name" content="Correctly" />

        {/* Icons & Manifest */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#72993e" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Colors */}
        <meta name="msapplication-TileColor" content="#31417a" />
        <meta name="theme-color" content="#ffffff" />

        {/* Apple PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Correctly" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </Head>

      <IonApp>
        <Component {...pageProps} />
        <GlobalNotificationsProvider />
      </IonApp>
    </SWRConfig>
  );
};

export default App;
