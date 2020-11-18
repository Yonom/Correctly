import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworksWithSolution, selectCourseUsersWithoutSolution } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';

const getCourseCSV = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');

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
