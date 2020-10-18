import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { insertHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';
import { isSuperuser } from '../../../utils/auth/role';
import { selectEditableCoursesForUser } from '../../../services/api/database/course';

const addHomeworkAPI = async (req, res, { userId, role }) => {
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
    verifyFileSize(exerciseAssignment);
    verifyFileSize(modelSolution);
    verifyFileSize(evaluationScheme);
    verifyFileNameSize(exerciseAssignmentName);
    verifyFileNameSize(modelSolutionName);
    verifyFileNameSize(evaluationSchemeName);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  let isAllowed;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
    // checks if given userid is allowed to change the given course
    const editableCourses = await selectEditableCoursesForUser(userId);
    isAllowed = courses.every((courseId) => {
      let has = false;
      for (let i = 0; i < editableCourses.rows.length; i++) {
        if (courseId === editableCourses.rows[i].id) { has = true; }
      }
      return has;
    });
  }

  if (!isAllowed) {
    // throws status(403) if user is not allowed to change the course
    return res.status(403).json({ code: 'homework/adding-not-allowed' });
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

export default authMiddleware(addHomeworkAPI);
