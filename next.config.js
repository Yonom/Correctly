/* eslint-disable no-param-reassign */
const path = require('path');
const withPWA = require('next-pwa');

const withSourceMaps = require('@zeit/next-source-maps')();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const {
  NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITHUB_COMMIT_REF,
  IS_CORRECTLY_PROD,
} = process.env;

module.exports = withSourceMaps(
  withPWA({
    webpack: (config, { isServer, webpack }) => {
      if (isServer) {
      // on vercel (serverless), the .keys folder is not properly copied to each serverless endpoint, so we implement a workaround here
      // in the final app and during development, configuration data is loaded from the .keys folder
      // also see src/utils/api/loadConfig.js

        // dev / normal build: configuration files are loaded at runtime from .keys folder and are dynamic
        // vercel build: the configuration files are copied into the finished bundle and are static

        const isVercel = !!process.env.VERCEL_URL;
        config.module.rules.push({
          include: [
            path.resolve(__dirname, '.keys'),
          ],
          type: 'javascript/auto',
          loader: isVercel ? 'raw-loader' : 'file-loader',
          options: isVercel ? {} : { name: '[path][name].[ext]' },
        });
      }

      // BEGIN SENTRY CONFIG
      // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
      // @sentry/node will run in a Node.js environment. @sentry/node will use
      // Node.js-only APIs to catch even more unhandled exceptions.
      //
      // This works well when Next.js is SSRing your page on a server with
      // Node.js, but it is not what we want when your client-side bundle is being
      // executed by a browser.
      //
      // Luckily, Next.js will call this webpack function twice, once for the
      // server and once for the client. Read more:
      // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
      //
      // So ask Webpack to replace @sentry/node imports with @sentry/browser when
      // building the browser's bundle
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }

      // Define an environment variable so source code can check whether or not
      // it's running on the server so we can correctly initialize Sentry
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_IS_SERVER': JSON.stringify(
            isServer.toString(),
          ),
        }),
      );

      // When all the Sentry configuration env variables are available/configured
      // The Sentry webpack plugin gets pushed to the webpack plugins to build
      // and upload the source maps to sentry.
      // This is an alternative to manually uploading the source maps
      // Note: This is disabled in development mode.
      if (SENTRY_ORG
      && SENTRY_PROJECT
      && SENTRY_AUTH_TOKEN
      && VERCEL_GITHUB_COMMIT_SHA
      && NODE_ENV === 'production'
      ) {
        config.plugins.push(
          new SentryWebpackPlugin({
            include: '.next',
            ignore: ['node_modules'],
            stripPrefix: ['webpack://_N_E/'],
            urlPrefix: '~/_next',
            release: VERCEL_GITHUB_COMMIT_SHA,
          }),
        );
      }
      // END SENTRY CONFIG

      return config;
    },
    target: 'experimental-serverless-trace',
    env: {
      VERCEL_GITHUB_COMMIT_REF,
      VERCEL_GITHUB_COMMIT_SHA,
      NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR,
      IS_CORRECTLY_PROD,
    },
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV === 'development',
    },
  }),
  '',
);
