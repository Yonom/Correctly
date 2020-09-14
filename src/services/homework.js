import fetchPost from '../utils/fetchPost';

export const addHomework = async (
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
) => {
  // eslint-disable-next-line no-console
  console.log('HALLO FILE 2');
  return await fetchPost('/api/homework/add', {
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
  });
};
