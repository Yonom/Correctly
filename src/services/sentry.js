/* eslint-disable no-param-reassign */
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

export const init = () => {
  const integrations = [];
  if (
    process.env.NEXT_IS_SERVER === 'true'
      && process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR
  ) {
    // For Node.js, rewrite Error.stack to use relative paths, so that source
    // maps starting with ~/_next map to files in Error.stack with path
    // app:///_next
    integrations.push(
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename.replace(
            process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR,
            'app:///',
          );
          frame.filename = frame.filename.replace('.next', '_next');
          return frame;
        },
      }),
    );
  }

  Sentry.init({
    enabled: true, // process.env.NODE_ENV === 'production',
    integrations,
    dsn: 'https://4fd075a0296c4407a14fb89237c13cb3@o475139.ingest.sentry.io/5512749',
    release: process.env.VERCEL_GITHUB_COMMIT_SHA,
  });
};
