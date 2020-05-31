import handleRequestMethod from '../../../utils/api/handleReq';
import { createNewCourse } from '../../../services/api/database/course';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');
  const {
    courseTitle,
    yearCode,
    users,
  } = req.body.formdata || {};

  // create new course with attendees as Transaction
  try {
    await createNewCourse(courseTitle, yearCode, users);
    return res.status(200).json({ });
  } catch (err) {
    console.log(err.stack);
    return res.status(500);
  }
  // as Query
  // const courseId = await addCourse(courseTitle, yearCode);
  // console.log(await addUsersToCourse(courseId, users), ' attendees have been created');
};
