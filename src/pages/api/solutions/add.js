import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { insertSolution } from '../../../services/api/database/solutions';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';

const addSolutionAPI = async (req, res, { userId }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkId,
    solutionFile,
    solutionFilename,
    solutionComment,
  } = req.body;

  try {
    verifyFileSize(solutionFile);
    verifyFileNameSize(solutionFilename);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  await insertSolution(
    userId,
    homeworkId,
    fromBase64(solutionFile),
    solutionFilename,
    solutionComment,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(addSolutionAPI);
