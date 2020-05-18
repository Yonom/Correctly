import handleRequestMethod from '../../../utils/api/handleReq';
import { selectUser } from '../../../services/api/database/user';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');
  const result = await selectUser();
  console.log(result);

  const {
    courseTitle,
    yearCode,
    persons,
  } = req.body || {};


  // await addCourse(courseTitle, yearCode, persons);

  return res.status(200).json({ });
};
