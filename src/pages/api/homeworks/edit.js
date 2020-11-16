import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectEditableHomeworksForUser, updateHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';
import withSentry from '../../../utils/api/withSentry';

const editHomeworkAPI = async (req, res, { userId, role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkName,
    maxReachablePoints,
    evaluationVariant,
    reviewerCount,
    auditors,
    samplesize,
    threshold,
    solutionAllowedFormats,
    reviewAllowedFormats,
    solutionStart,
    solutionEnd,
    reviewStart,
    reviewEnd,
    taskFiles,
    taskFileNames,
    sampleSolutionFiles,
    sampleSolutionFileNames,
    evaluationSchemeFiles,
    evaluationSchemeFileNames,
    homeworkId,
  } = req.body;

  // check if the user has the permission to create a homework
  try {
    verifyFileSize(taskFiles);
    verifyFileSize(sampleSolutionFiles);
    verifyFileSize(evaluationSchemeFiles);
    verifyFileNameSize(taskFileNames);
    verifyFileNameSize(sampleSolutionFileNames);
    verifyFileNameSize(evaluationSchemeFileNames);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  let isAllowed = false;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
    // checks if given userid is allowed to change the given homework
    const editableCourses = await selectEditableHomeworksForUser(userId, false);
    for (let i = 0; i < editableCourses.rows.length; i++) {
      if (homeworkId === editableCourses.rows[i].id) { isAllowed = true; }
    }
  }

  if (!isAllowed) {
    // throws status(403) if user is not allowed to change the homework
    return res.status(403).json({ code: 'homework/editing-not-allowed' });
  }

  await updateHomework(
    homeworkName,
    maxReachablePoints,
    evaluationVariant,
    reviewerCount,
    auditors,
    samplesize,
    threshold,
    solutionAllowedFormats,
    reviewAllowedFormats,
    solutionStart,
    solutionEnd,
    reviewStart,
    reviewEnd,
    fromBase64(taskFiles),
    taskFileNames,
    fromBase64(sampleSolutionFiles),
    sampleSolutionFileNames,
    fromBase64(evaluationSchemeFiles),
    evaluationSchemeFileNames,
    homeworkId,
  );

  // empty json to confirm success
  return res.json({});
};

export default withSentry(authMiddleware(editHomeworkAPI));
