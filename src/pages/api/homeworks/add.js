import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { insertHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';

const addHomework = async (req, res, { userId, role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkName,
    courses,
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
  } = req.body;

  // check if the user has the permission to update a homework
  try {
    verifyLecturer(role);
    verifyFileSize(exerciseAssignment);
    verifyFileSize(modelSolution);
    verifyFileSize(evaluationScheme);
    verifyFileNameSize(exerciseAssignmentName);
    verifyFileNameSize(modelSolutionName);
    verifyFileNameSize(evaluationSchemeName);
  } catch ({ code }) {
    return res.status(401).json({ code });
  }

  await insertHomework(
    homeworkName,
    courses,
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
    userId,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(addHomework);
