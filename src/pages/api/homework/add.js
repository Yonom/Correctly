import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import insertHomework from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const addHomework = async (req, res, { role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  } = req.body;

  // check if the user has the permission to create a homework
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(401).json({ code });
  }

  await insertHomework(
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(addHomework);
