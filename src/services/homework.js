import fetchPost from '../utils/fetchPost';

export const addHomework = async (
  exercise,
  solution,
  evaluation,
  doingStart,
  doingEnd,
  correctingStart,
  correctingEnd,
  dataFormat,
  correctingType,
  correctingAmountStudent,
  correctingAmountProf,
  criticalEvaluation,
) => {
  return await fetchPost('/api/homework/add', {
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  });
};
