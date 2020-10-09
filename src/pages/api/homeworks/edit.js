import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectEditableHomeworksForUser, updateHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const editHomework = async (req, res, { userId, role }) => {
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

  let isAllowed = false;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
    // checks if given userid is allowed to change the given course
    const editableCourses = await selectEditableHomeworksForUser(userId);
    for (let i = 0; i < editableCourses.rows.length; i++) {
      if (homeworkId === editableCourses.rows[i].id) { isAllowed = true; }
    }
  }

  if (!isAllowed) {
    // throws status(403) if user is not allowed to change the course
    return res.status(403).json({ code: 'homework/updating-not-allowed' });
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
