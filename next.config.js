const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // there are three modes available: dev, server, vercel (serverless)
      // in the final app (dev and server modes), configuration data is loaded from the .keys folder
      // on vercel (serverless), the .keys folder is not properly copied to each serverless endpoint, so we implement a workaround here

      // dev / server mode: files in .keys folder will be imported as filepath
      // vercel mode: files in .keys folder will be imported as content

      const isVercel = !!process.env.VERCEL_URL;
      config.module.rules.push({
        include: [
          path.resolve(__dirname, '.keys'),
        ],
        type: 'javascript/auto',
        loader: isVercel ? 'raw-loader' : 'file-loader',
        options: { name: '[path][name].[ext]' },
      });
    }
    return config;
  },
  target: 'experimental-serverless-trace',
};
