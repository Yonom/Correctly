import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourse } from '../../../services/api/database/course';

const getCourse = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { courseId } = req.query;

  if (courseId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'course/no-course-id' });
  }

  const courseQuery = await selectCourse(courseId);
  if (courseQuery.rows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }
  const course = courseQuery.rows[0];
  // empty json to confirm success
  return res.json(course);
};

export default getCourse;
