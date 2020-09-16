import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectSolution } from '../../../services/api/database/solutions';

const doSomething = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { userId, homeworkId } = req.query;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  const coursesQuery = await selectSolution(userId, homeworkId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'solutions/no-solution-found' });
  }

  const solution = coursesQuery.rows[0];

  // empty json to confirm success
  return res.json({
    id: solution.id,
    userid: solution.userid,
    homeworkid: solution.homeworkid,
    courseid: solution.courseid,
    filename: solution.solutionfilename,
  });
};

export default doSomething;
