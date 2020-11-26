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

export const AUDIT_REASON_THRESHOLD = 'threshold';
export const AUDIT_REASON_SAMPLESIZE = 'samplesize';
export const AUDIT_REASON_PLAGIARISM = 'plagiarism';
export const AUDIT_REASON_DID_NOT_SUBMIT_REVIEW = 'did-not-submit-review';
export const AUDIT_REASON_MISSING_REVIEW_SUBMISSION = 'missing-review-submission';

export const EFFORTS = 'efforts';
export const ZERO_TO_ONE_HUNDRED = 'zeroToOnehundred';
export const NOT_WRONG_RIGHT = 'notWrongRight';
export const ITS_OK_TO_FAIL = 'itsOkayToFail';
export const POINTS = 'points';

export const PLAGIARISM_SIMILARITY_THRESHOLD = 80;

// minimum character length for a text solution to be considered for plagiarism check
export const PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD = 40;

export const SQL_FOR_PERCENTAGE_GRADE = `    
  LEFT JOIN reviews ON solutions.id = reviews.solutionid AND issubmitted AND 0 = (
    -- take all student reviews if no lecturer review exists
    -- take the most recent lecturer review if one or more exist
    SELECT COUNT(*)
    FROM reviews AS r2 
    WHERE r2.solutionid = solutions.id 
    AND (r2.islecturerreview OR r2.issystemreview)
    AND (
      NOT (reviews.islecturerreview OR reviews.issystemreview)
      OR r2.submitdate > reviews.submitdate
    )
  )
`;
