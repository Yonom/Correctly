import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomework, selectHomeworkForUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';

const getHomework = async (req, res, { userId, role }) => {
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  let userQuery;
  if (isSuperuser(role)) {
    userQuery = await selectHomework(homeworkId);
  } else {
    userQuery = await selectHomeworkForUser(homeworkId, userId);
  }

  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = userQuery.rows[0];
  return res.json({
    courseYearcode: homework.yearcode,
    courseTitle: homework.title,
    homeworkName: homework.homeworkname,
    courseId: homework.courseid,
    maxReachablePoints: homework.maxreachablepoints,
    evaluationVariant: homework.evaluationvariant,
    correctionVariant: homework.correctionvariant,
    correctionValidation: homework.correctionvalidation,
    samplesize: homework.samplesize,
    threshold: homework.samplesize,
    solutionAllowedFormats: homework.solutionallowedformats,
    correctionAllowedFormats: homework.correctionallowedformats,
    doingStart: homework.doingstart,
    doingEnd: homework.doingend,
    correctingStart: homework.correctingstart,
    correctingEnd: homework.correctingend,
    exerciseAssignmentName: homework.exerciseassignmentname[0],
    modelSolutionName: (homework.modelsolutionname || {})[0],
    evaluationSchemeName: (homework.evaluationschemename || {})[0],
  });
};
export default authMiddleware(getHomework);
