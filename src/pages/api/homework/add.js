import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import insertHomework from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const addHomework = async (req, res, { role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    homeworkName,
    courses,
    maxReachablePoints,
    requireCorrectingDocumentationFile,
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
    modelSolution,
    evaluationScheme,
  } = req.body;

  console.log('HALLO FILE VORHER');
  // check if the user has the permission to create a homework
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(401).json({ code });
  }

  console.log('HALLO FILE DANACH');

  await insertHomework(
    homeworkName,
    courses,
    maxReachablePoints,
    requireCorrectingDocumentationFile,
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
    modelSolution,
    evaluationScheme,
  );

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(addHomework);
