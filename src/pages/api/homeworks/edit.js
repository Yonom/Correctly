import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const editHomework = async (req, res, { role }) => {
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
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(401).json({ code });
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
    exerciseAssignment,
    exerciseAssignmentName,
    modelSolution,
    modelSolutionName,
    evaluationScheme,
    evaluationSchemeName,
    homeworkId,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(editHomework);