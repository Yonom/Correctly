import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworksWithSolution } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';

const getCourseCSV = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');

  const { courseId } = req.query;

  if (courseId == null) {
    return res.status(400).json({ code: 'course/no-course-id' });
  }

  const courseQuery = await selectHomeworksWithSolution(courseId);

  if (courseQuery.rows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }

  return res.json(courseQuery.rows.map((homework) => ({
    id: homework.id,
    userid: homework.userid,
    homeworkname: homework.homeworkname,
    title: homework.title,
    yearcode: homework.yearcode,
    firstname: homework.firstname,
    lastname: homework.lastname,
    maxreachablepoints: homework.maxreachablepoints,
    percentagegrade: 'to come',
  })));
};

export default withSentry(authMiddleware(getCourseCSV));
