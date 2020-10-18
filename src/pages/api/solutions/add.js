import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { insertSolution, selectCanSubmitSolution } from '../../../services/api/database/solutions';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyFileNameAllowedFormats, verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';
import { selectHomeworkSolutionAllowedFormats } from '../../../services/api/database/homework';

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

  const allowedFormats = await selectHomeworkSolutionAllowedFormats(homeworkId);

  try {
    verifyFileSize(solutionFile);
    verifyFileNameSize(solutionFilename);
    verifyFileNameAllowedFormats(solutionFilename, allowedFormats);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  if (!(await selectCanSubmitSolution(homeworkId, userId))) {
    return res.status(400).json({ code: 'solution/not-available-for-submission' });
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
