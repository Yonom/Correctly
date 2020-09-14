const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
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
    return config;
  },
  target: 'experimental-serverless-trace',
  env: {
    VERCEL_GITHUB_COMMIT_REF: process.env.VERCEL_GITHUB_COMMIT_REF,
    VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
};
