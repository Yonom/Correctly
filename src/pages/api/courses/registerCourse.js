import handleRequestMethod from '../../../utils/api/handleReq';
import { addCourse, addUsersToCourse, createNewCourse } from '../../../services/api/database/course';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');
  console.log('request received');

  const {
    courseTitle,
    yearCode,
    users,
  } = req.body.formdata || {};
  console.log('the following data has been sent:', 'title:', courseTitle, 'yearCode:', yearCode, 'users:', users);

  // as Transaction
  // try {
  //   const courseRes = await createNewCourse(courseTitle, yearCode, users);
  //   console.log('courseRes =', courseRes);
  // } catch (err) {
  //   console.log(9, err);
  // }


  // as Query
  const courseId = await addCourse(courseTitle, yearCode);
  console.log(await addUsersToCourse(courseId, users), ' attendees have been created');

  return res.status(200).json({ });
};
