export const NOT_DONE = 'not-done';
export const WRONG = 'wrong';
export const RIGHT = 'right';
export const EFFORT = 'effort';
export const NO_EFFORT = 'no-effort';

export const THRESHOLD_NA = -1;

export const TEXTFIELD = 'textfield';

export const ONE_REVIEWER = 'correct-one';
export const TWO_REVIEWERS = 'correct-two';

export const AUDIT_BY_LECTURERS = 'lecturers';
export const AUDIT_BY_MODULE_COORDINATOR = 'modulecoordinator';

export const EFFORTS = 'efforts';
export const ZERO_TO_ONE_HUNDRED = 'zeroToOnehundred';
export const NOT_WRONG_RIGHT = 'notWrongRight';
export const ITS_OK_TO_FAIL = 'itsOkayToFail';
export const POINTS = 'points';

export const SQL_FOR_PERCENTAGE_GRADE = `    
  LEFT JOIN reviews ON solutions.id = reviews.solutionid AND issubmitted AND 0 = (
    -- take all student reviews if no lecturer review exists
    -- take the most recent lecturer review if one or more exist
    SELECT COUNT(*)
    FROM reviews AS r2 
    WHERE r2.solutionid = solutions.id 
    AND (r2.islecturerreview OR r2.issystemreview)
    AND (
      NOT (r2.islecturerreview OR r2.issystemreview) 
      OR r2.submitdate > reviews.submitdate
    )
  )
`;
