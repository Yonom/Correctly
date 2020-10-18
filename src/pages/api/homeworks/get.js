import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworkForUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isStudent, isSuperuser } from '../../../utils/auth/role';
import { selectSolutionsAndGrades, selectUsersWithoutSolution } from '../../../services/api/database/solutions';

const getHomeworkAPI = async (req, res, { userId, role }) => {
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  const homeworkQuery = await selectHomeworkForUser(homeworkId, userId, isSuperuser(role));
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const solutionsQuery = await selectSolutionsAndGrades(homeworkId);
  const usersWithoutSolutionQuery = await selectUsersWithoutSolution(homeworkId);
  const homework = homeworkQuery.rows[0];
  let returnSolutions = solutionsQuery.rows;
  let returnUsersWithoutSolutionQuery = usersWithoutSolutionQuery.rows;

  if (isStudent(role)) {
    returnSolutions = returnSolutions.filter((x) => x.userid === userId).map(({ percentageGrade, ...rest }) => {
      // for now, do not return the grades for students
      return rest;
    });
    returnUsersWithoutSolutionQuery = [];
  }

  return res.json({
    courseYearcode: homework.yearcode,
    courseTitle: homework.title,
    homeworkName: homework.homeworkname,
    courseId: homework.courseid,
    maxReachablePoints: homework.maxreachablepoints,
    evaluationVariant: homework.evaluationvariant,
    correctionVariant: homework.reviewercount,
    correctionValidation: homework.auditors,
    samplesize: homework.samplesize,
    threshold: homework.samplesize,
    solutionAllowedFormats: homework.solutionallowedformats,
    correctionAllowedFormats: homework.reviewallowedformats,
    doingStart: homework.solutionstart,
    doingEnd: homework.solutionend,
    correctingStart: homework.reviewstart,
    correctingEnd: homework.reviewend,
    exerciseAssignmentName: homework.taskfilenames[0],
    modelSolutionName: (homework.samplesolutionfilesnamess || {})[0],
    evaluationSchemeName: (homework.evaluationschemefilenames || {})[0],
    solutions: returnSolutions,
    usersWithoutSolution: returnUsersWithoutSolutionQuery,
  });
};
export default authMiddleware(getHomeworkAPI);
