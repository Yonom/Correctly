import handleRequestMethod from '../../../utils/api/handleReq';
import { selectAllCourses, addCourse, addUsersToCourse } from '../../../services/api/database/course';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');

  const {
    courseTitle,
    yearCode,
    users,
  } = req.body.formdata || {};

  const courseId = await addCourse(courseTitle, yearCode);
  await addUsersToCourse(courseId, users);
  console.log('The following course has been created:', courseId);

  return res.status(200).json({ });
};
