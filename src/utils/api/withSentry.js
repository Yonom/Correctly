import * as Sentry from '@sentry/node';
import { init } from '../../services/sentry';

init();

const withSentry = (apiHandler) => {
  return async (req, res) => {
    try {
      return await apiHandler(req, res);
    } catch (error) {
      Sentry.captureException(error);
      await Sentry.flush(2000);
      throw error;
    }
  };
};

export default withSentry;
