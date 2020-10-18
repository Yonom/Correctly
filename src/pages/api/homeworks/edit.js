import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectEditableHomeworksForUser, updateHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';

const editHomeworkAPI = async (req, res, { userId, role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkName,
    maxReachablePoints,
    evaluationVariant,
    correctionVariant,
    correctionValidation,
    samplesize,
    threshold,
    solutionAllowedFormats,
    correctionAllowedFormats,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    exerciseAssignment,
    exerciseAssignmentName,
    modelSolution,
    modelSolutionName,
    evaluationScheme,
    evaluationSchemeName,
    homeworkId,
  } = req.body;

  // check if the user has the permission to create a homework
  try {
    verifyFileSize(exerciseAssignment);
    verifyFileSize(modelSolution);
    verifyFileSize(evaluationScheme);
    verifyFileNameSize(exerciseAssignmentName);
    verifyFileNameSize(modelSolutionName);
    verifyFileNameSize(evaluationSchemeName);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  let isAllowed = false;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
    // checks if given userid is allowed to change the given homework
    const editableCourses = await selectEditableHomeworksForUser(userId);
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
    correctionVariant,
    correctionValidation,
    samplesize,
    threshold,
    solutionAllowedFormats,
    correctionAllowedFormats,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    fromBase64(exerciseAssignment),
    exerciseAssignmentName,
    fromBase64(modelSolution),
    modelSolutionName,
    fromBase64(evaluationScheme),
    evaluationSchemeName,
    homeworkId,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(editHomeworkAPI);
