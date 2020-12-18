import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworkForUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isStudent, isSuperuser } from '../../../utils/auth/role';
import { selectSolutionsAndGrades, selectUsersWithoutSolution } from '../../../services/api/database/solutions';
import { homeworkVisible } from '../../../utils/homeworkVisible';
import withSentry from '../../../utils/api/withSentry';

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

  if (!homeworkVisible(homeworkQuery.rows[0].solutionstart, role)) {
    return res.status(403).json({ code: 'homework/not-available' });
  }

  const solutionsQuery = await selectSolutionsAndGrades(homeworkId);
  const usersWithoutSolutionQuery = await selectUsersWithoutSolution(homeworkId);
  const homework = homeworkQuery.rows[0];
  let returnSolutions = solutionsQuery.rows;
  let returnUsersWithoutSolutionQuery = usersWithoutSolutionQuery.rows;

  const visible = homeworkVisible(homeworkQuery.rows[0].solutionstart, role);

  // checks if role is student and if grades have been published and if there is already a solution
  // if they have not been published the grade will be set to undefined
  if (isStudent(role)) {
    const index = returnSolutions.findIndex((sol) => sol.userid === userId);
    if (index !== -1) {
      returnSolutions[index].hasunresolvedaudit = undefined;
      if (!homework.gradespublished) {
        returnSolutions[index].percentagegrade = undefined;
      }
    }
    returnSolutions = returnSolutions.filter((x) => x.userid === userId);
    returnUsersWithoutSolutionQuery = returnUsersWithoutSolutionQuery.filter((x) => x.userid === userId);
  }

  return res.json({
    courseYearcode: homework.yearcode,
    courseTitle: homework.title,
    homeworkName: homework.homeworkname,
    courseId: homework.courseid,
    maxReachablePoints: homework.maxreachablepoints,
    evaluationVariant: homework.evaluationvariant,
    reviewerCount: homework.reviewercount,
    auditors: homework.auditors,
    samplesize: homework.samplesize,
    threshold: homework.threshold,
    solutionAllowedFormats: homework.solutionallowedformats,
    reviewAllowedFormats: homework.reviewallowedformats,
    solutionStart: homework.solutionstart,
    solutionEnd: homework.solutionend,
    reviewStart: homework.reviewstart,
    reviewEnd: homework.reviewend,
    hasDistributedReviews: homework.hasdistributedreviews,
    hasDistributedAudits: homework.hasdistributedaudits,
    taskFileNames: homework.taskfilenames[0],
    sampleSolutionFileNames: (homework.samplesolutionfilenames || {})[0],
    evaluationSchemeFileNames: (homework.evaluationschemefilenames || {})[0],
    solutions: returnSolutions,
    usersWithoutSolution: returnUsersWithoutSolutionQuery,
    gradesPublished: homework.gradespublished,
    visible,
  });
};
export default withSentry(authMiddleware(getHomeworkAPI));
