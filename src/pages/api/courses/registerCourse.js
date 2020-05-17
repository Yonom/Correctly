import handleRequestMethod from '../../../utils/api/handleReq';


export default async (req, res) => {
// Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');

  const {
    courseTitle,
    yearCode,
    persons,
  } = req.body || {};


  await addCourse(courseTitle, yearCode, persons);

  return res.status(200).json({ });
};
