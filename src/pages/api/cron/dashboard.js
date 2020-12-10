import { databaseQuery } from '../../../services/api/database';
import withSentry from '../../../utils/api/withSentry';

const dashboardRefreshAPI = async (req, res) => {
  databaseQuery('REFRESH MATERIALIZED VIEW solutionhistory');
  databaseQuery('REFRESH MATERIALIZED VIEW gradehistory');
  await databaseQuery('REFRESH MATERIALIZED VIEW homeworkhistory');
  return res.json({ });
};

export default withSentry(dashboardRefreshAPI);
