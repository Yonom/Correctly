import { databaseQuery } from '../../../services/api/database';
import withSentry from '../../../utils/api/withSentry';

const dashboardRefreshAPI = async (req, res) => {
  await databaseQuery('REFRESH MATERIALIZED VIEW homeworkhistorylong');
  await databaseQuery('REFRESH MATERIALIZED VIEW solutionhistorylong');
  await databaseQuery('REFRESH MATERIALIZED VIEW gradehistorylong');
  return res.json({ });
};

export default withSentry(dashboardRefreshAPI);
