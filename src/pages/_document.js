import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="de">
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

          <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZXXCFYRE3J" />

          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-ZXXCFYRE3J', {
                  page_path: window.location.pathname,
                });
                gtag('consent', 'default', {
                  'analytics_storage': 'denied'
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
