import { EFFORT, EFFORTS, ITS_OK_TO_FAIL, NOT_DONE, NOT_WRONG_RIGHT, NO_EFFORT, POINTS, RIGHT, WRONG, ZERO_TO_ONE_HUNDRED } from './constants';

const getGradeFromPoints = (homework, percentageGrade) => {
  return (percentageGrade / 100) * homework.maxreachablepoints;
};

const getGradeFromZeroToOnehundred = (_, percentageGrade) => {
  return percentageGrade;
};

const getGradeFromNotWrongRight = (_, percentageGrade) => {
  switch (percentageGrade) {
    // case 0:
    // return NOT_DONE;

    case 0:
      return WRONG;

    case 100:
      return RIGHT;

    default:
      throw new Error('Unknown value for notWrongRight');
  }
};

const getGradeItsOkayToFail = (_, percentageGrade) => {
  switch (percentageGrade) {
    case 0:
      return NOT_DONE;

    case 50:
      return WRONG;

    case 100:
      return RIGHT;

    default:
      throw new Error('Unknown value for itsOkayToFail');
  }
};

const getGradeFromEfforts = (_, percentageGrade) => {
  switch (percentageGrade) {
    case 100:
      return EFFORT;

    case 0:
      return NO_EFFORT;

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

export const getOriginalGrade = (homework, percentageGrade) => {
  // run the getGrade method corresponding to the evaluationvariant
  return mapping[homework.evaluationvariant](homework, percentageGrade);
};
