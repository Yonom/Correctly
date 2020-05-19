import handleRequestMethod from '../../../utils/api/handleReq';
import { addCourse, addUsersToCourse } from '../../../services/api/database/course';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');

  const {
    courseTitle,
    yearCode,
    users,
  } = req.body || {};
  // REMINDER: add .formdata
  // calling addCourse and addUserstoCourse Functions and logging results
  const courseId = await addCourse(courseTitle, yearCode);
  console.log('The following course has been created:', courseId);
  console.log(await addUsersToCourse(courseId, users), ' attendees have been created');
  return res.status(200).json({ });
};
