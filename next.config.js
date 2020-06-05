const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.module.rules.push({
        // everything in .keys folder will be imported as filepath (not contents)
        include: [
          path.resolve(__dirname, '.keys'),
        ],
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '_next/serverless/config/',
          outputPath: 'config/',
        },
      });
    }
    return config;
  },
};
