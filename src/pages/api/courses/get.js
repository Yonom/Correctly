import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourseForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { selectAttendees } from '../../../services/api/database/attends';
import { selectHomeworksForCourse } from '../../../services/api/database/homework';
import { homeworkVisible } from '../../../utils/homeworkVisible';
import withSentry from '../../../utils/api/withSentry';

const getCourseAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { courseId } = req.query;

  if (courseId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'course/no-course-id' });
  }

  const courseQuery = await selectCourseForUser(courseId, userId, isSuperuser(role));

  if (courseQuery.rows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }

  const course = courseQuery.rows[0];
  const attendees = (await selectAttendees(courseId)).rows;
  const homeworks = (await selectHomeworksForCourse(courseId, userId)).rows;

  // setting "visible" variable of homeworks
  for (const i of homeworks) {
    i.visible = homeworkVisible(i.solutionstart, role);
  }

  // empty json to confirm success
  return res.json({ ...course, attendees, homeworks });
};

export default withSentry(authMiddleware(getCourseAPI));
