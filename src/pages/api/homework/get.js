import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomework } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getHomework = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  const userQuery = await selectHomework(homeworkId);
  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = userQuery.rows[0];
  return res.json({
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
    exerciseAssignment: homework.exerciseassignment[0],
    exerciseAssignmentName: homework.exerciseassignmentname[0],
    modelSolution: (homework.modelsolution || {})[0],
    modelSolutionName: (homework.modelsolutionname || {})[0],
    evaluationScheme: (homework.evaluationscheme || {})[0],
    evaluationSchemeName: (homework.evaluationschemename || {})[0],
  });
};
export default authMiddleware(getHomework);
