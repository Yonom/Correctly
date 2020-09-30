import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';


export const useHomeworkForCourse = (courseId) => {
  return useSWR(`/api/homework/${courseId}`);
};

export const addHomework = async (
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
) => {
  return await fetchPost('/api/homework/add', {
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
  });
};
