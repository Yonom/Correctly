import * as Sentry from '@sentry/node';
import { init } from '../../services/sentry';
import { getTokenData } from './auth/tokenCookie';

init();

const withSentry = (apiHandler) => {
  return async (req, res) => {
    try {
      return await apiHandler(req, res);
    } catch (error) {
      let userId;
      let role;
      try {
        const token = await getTokenData(req);
        userId = token.userId;
        role = token.role;
      } catch {
        // ignore
      }

      Sentry.withScope((scope) => {
        scope.setUser({ userId, role });
        scope.setLevel('fatal');
        scope.addEventProcessor(async (event) => {
          return Sentry.Handlers.parseRequest(event, req);
        });

        Sentry.captureException(error);
      });

      await Sentry.flush(2000);
      throw error;
    }
  };
};

export default withSentry;
