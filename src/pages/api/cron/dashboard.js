import { databaseQuery } from '../../../services/api/database';
import withSentry from '../../../utils/api/withSentry';

const dashboardRefreshAPI = async (req, res) => {
  await databaseQuery('REFRESH MATERIALIZED VIEW homeworkhistory');
  await databaseQuery('REFRESH MATERIALIZED VIEW solutionhistory');
  await databaseQuery('REFRESH MATERIALIZED VIEW gradehistory');
  return res.json({ });
};

export default withSentry(dashboardRefreshAPI);
