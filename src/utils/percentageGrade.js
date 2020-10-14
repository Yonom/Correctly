import { EFFORT, EFFORTS, ITS_OK_TO_FAIL, NOT_DONE, NOT_WRONG_RIGHT, NO_EFFORT, POINTS, RIGHT, WRONG, ZERO_TO_ONE_HUNDRED } from './percentageGradeConst';

const getGradeFromPoints = (homework, points) => {
  return (points * 100) / homework.maxreachablepoints;
};

const getGradeFromZeroToOnehundred = (_, zeroToOnehundred) => {
  return zeroToOnehundred;
};

const getGradeFromNotWrongRight = (_, notWrongRight) => {
  switch (notWrongRight) {
    case NOT_DONE:
      return 0;

    case WRONG:
      return 0;

    case RIGHT:
      return 100;

    default:
      throw new Error('Unknown value for notWrongRight');
  }
};

const getGradeItsOkayToFail = (_, notWrongRight) => {
  switch (notWrongRight) {
    case NOT_DONE:
      return 0;

    case WRONG:
      return 50;

    case RIGHT:
      return 100;

    default:
      throw new Error('Unknown value for notWrongRight');
  }
};

const getGradeFromEfforts = (_, didEffort) => {
  switch (didEffort) {
    case EFFORT:
      return 100;

    case NO_EFFORT:
      return 0;

    default:
      throw new Error('Unknown value for effort');
  }
};

const mapping = {
  [POINTS]: getGradeFromPoints,
  [ZERO_TO_ONE_HUNDRED]: getGradeFromZeroToOnehundred,
  [NOT_WRONG_RIGHT]: getGradeFromNotWrongRight,
  [ITS_OK_TO_FAIL]: getGradeItsOkayToFail,
  [EFFORTS]: getGradeFromEfforts,
};

export const getPercentageGrade = (homework, grading) => {
  // run the getGrade method corresponding to the evaluationvariant
  return mapping[homework.evaluationvariant](homework, grading);
};
