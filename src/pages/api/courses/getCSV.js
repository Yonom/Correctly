import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworksWithSolution, selectCourseUsersWithoutSolution } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import withSentry from '../../../utils/api/withSentry';

const getCourseCSV = async (req, res, { role }) => {
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const { courseId } = req.query;

  if (courseId == null) {
    return res.status(400).json({ code: 'course/no-course-id' });
  }

  const courseQuery = await selectHomeworksWithSolution(courseId);

  const courseNoSolutionQuery = await selectCourseUsersWithoutSolution(courseId);

  const allRows = courseQuery.rows.concat(courseNoSolutionQuery.rows);

  if (allRows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }

  return res.json(allRows.map((homework) => ({
    id: homework.id,
    userid: homework.userid,
    homeworkname: homework.homeworkname,
    title: homework.title,
    yearcode: homework.yearcode,
    name: `${homework.firstname} ${homework.lastname}`,
    maxreachablepoints: homework.maxreachablepoints,
    percentagegrade: homework.percentagegrade,
    actualpointsearned: (parseFloat(homework.percentagegrade) * parseFloat(homework.maxreachablepoints)) / 100,
  })));
};

export default withSentry(authMiddleware(getCourseCSV));
