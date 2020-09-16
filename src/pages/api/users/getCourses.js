import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourses } from '../../../services/api/database/user';

const doSomething = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { userId } = req.query;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  const coursesQuery = await selectCourses(userId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'courses/no-courses' });
  }

  const courseTitles = [];
  const courseYearcodes = [];
  for (let i = 0; i < coursesQuery.rows.length; i++) {
    courseTitles.push(coursesQuery.rows[i].title);
    courseYearcodes.push(coursesQuery.rows[i].yearcode);
  }

  // empty json to confirm success
  return res.json({
    titles: courseTitles,
    ids: courseYearcodes,
  });
};

export default doSomething;
