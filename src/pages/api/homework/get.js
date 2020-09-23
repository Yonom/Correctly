import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getHomework = async (req, res, { homeworkId }) => {
  await handleRequestMethod(req, res, 'GET');

  console.log(homeworkId);

  const result = await selectHomework(
    homeworkId,
  );

  debugger;

  const result2 = result.rows[0];
  console.log('---------------------------------------');
  console.log(result2);
  console.log('---------------------------------------');

  return res.json({
    homeworkName: result2.homeworkname,
    courseId: result2.courseid,
    samplesize: result2.samplesize,
  });
};

export default authMiddleware(getHomework);
