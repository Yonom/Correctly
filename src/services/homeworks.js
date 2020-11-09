import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const addHomework = async (
  homeworkName,
  courses,
  maxReachablePoints,
  evaluationVariant,
  reviewerCount,
  auditors,
  samplesize,
  threshold,
  solutionAllowedFormats,
  reviewAllowedFormats,
  solutionStart,
  solutionEnd,
  reviewStart,
  reviewEnd,
  taskFiles,
  taskFileNames,
  sampleSolutionFiles,
  sampleSolutionFileNames,
  evaluationSchemeFiles,
  evaluationSchemeFileNames,
) => {
  return await fetchPost('/api/homeworks/add', {
    homeworkName,
    courses,
    maxReachablePoints,
    evaluationVariant,
    reviewerCount,
    auditors,
    samplesize,
    threshold,
    solutionAllowedFormats,
    reviewAllowedFormats,
    solutionStart,
    solutionEnd,
    reviewStart,
    reviewEnd,
    taskFiles,
    taskFileNames,
    sampleSolutionFiles,
    sampleSolutionFileNames,
    evaluationSchemeFiles,
    evaluationSchemeFileNames,
  });
};

export const editHomework = async (
  homeworkName,
  maxReachablePoints,
  evaluationVariant,
  reviewerCount,
  auditors,
  samplesize,
  threshold,
  solutionAllowedFormats,
  reviewAllowedFormats,
  solutionStart,
  solutionEnd,
  reviewStart,
  reviewEnd,
  taskFiles,
  taskFileNames,
  sampleSolutionFiles,
  sampleSolutionFileNames,
  evaluationSchemeFiles,
  evaluationSchemeFileNames,
  homeworkId,
) => {
  return await fetchPost('/api/homeworks/edit', {
    homeworkName,
    maxReachablePoints,
    evaluationVariant,
    reviewerCount,
    auditors,
    samplesize,
    threshold,
    solutionAllowedFormats,
    reviewAllowedFormats,
    solutionStart,
    solutionEnd,
    reviewStart,
    reviewEnd,
    taskFiles,
    taskFileNames,
    sampleSolutionFiles,
    sampleSolutionFileNames,
    evaluationSchemeFiles,
    evaluationSchemeFileNames,
    homeworkId,
  });
};

export const useHomework = (homeworkId) => {
  return useSWR(homeworkId ? `/api/homeworks/get?homeworkId=${homeworkId}` : null);
};

export const useMyHomeworks = () => {
  return useSWR('/api/homeworks/my');
};

export const useMyEditableHomeworks = () => {
  return useSWR('/api/homeworks/myEditable');
};

export const homeworksPublishGrades = async (homeworkId) => {
  return await fetchPost('/api/homeworks/publishGrades', { homeworkId });
};
