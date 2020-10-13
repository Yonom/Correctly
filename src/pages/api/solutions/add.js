import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { insertSolution } from '../../../services/api/database/solutions';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const addSolution = async (req, res, { userId }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkId,
    solutionFile,
    solutionFilename,
    solutioncomment,
  } = req.body;

  await insertSolution(
    userId,
    homeworkId,
    solutionFile,
    solutionFilename,
    solutioncomment,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(addSolution);
