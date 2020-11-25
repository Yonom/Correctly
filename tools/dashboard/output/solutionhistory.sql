DROP MATERIALIZED VIEW IF EXISTS solutionhistorylong;
DROP MATERIALIZED VIEW IF EXISTS solutionhistory;
CREATE MATERIALIZED VIEW solutionhistory AS
  SELECT
    s.day AS day,
    homeworks.homeworkname AS homeworkname,
    homeworks.solutionstart AS solutionstart,
    homeworks.solutionend AS solutionend,
    homeworks.reviewstart AS reviewstart,
    homeworks.reviewend AS reviewend,
    homeworks.solutionstart <= s.day AND (homeworks.gradespublishdate IS NULL OR homeworks.gradespublishdate > s.day) AS active,
    courses.title AS title,
    courses.yearcode AS yearcode,
    COUNT(hasactiveaudit.bool) AS hasactiveaudit,
    COUNT(published.bool) AS published,
    COUNT(insubmission.bool) AS insubmission,
    COUNT(didnotsubmit.bool) AS didnotsubmit,
    COUNT(submitted.bool) AS submitted,
    COUNT(plagiarismtrigger.bool) AS plagiarismtrigger,
    COUNT(inreview.bool) AS inreview,
    COUNT(didnotreview.bool) AS didnotreview,
    COUNT(inaudit.bool) AS inaudit,
    COUNT(waitingforpublish.bool) AS waitingforpublish,
    COUNT(reviewedbylecturer.bool) AS reviewedbylecturer,
    COUNT(reviewedbystudent.bool) AS reviewedbystudent,
    COUNT(notstarted.bool) AS notstarted
  FROM (
    SELECT series.day + IF(series.day = NOW()::DATE, NOW()::TIME, TIME '23:59:59') AS day 
    FROM (
      SELECT GENERATE_SERIES(
        TIMESTAMP '2020-11-11', 
        now()::TIMESTAMP + INTERVAL '3 days', 
        INTERVAL '1 day'
      )::DATE AS day 
    ) series 
  ) s
  LEFT JOIN homeworks
    ON TRUE
  LEFT JOIN courses
    ON homeworks.courseid = courses.id
  LEFT JOIN attends
    ON attends.courseid = homeworks.courseid AND attends.isstudent 
  LEFT JOIN solutions
    ON solutions.userid = attends.userid AND solutions.homeworkid = homeworks.id AND solutions.submitdate <= s.day
  LEFT JOIN (
    SELECT
      reviewtimeframes.solutionid,
      reviewtimeframes.validfrom,
      reviewtimeframes.validto,
      MAX(reviews.islecturerreview) AS islecturerreview,
      MAX(reviews.issystemreview) AS issystemreview,
      COUNT(reviews.id) AS reviewcount,
      AVG(reviews.percentagegrade) AS percentagegrade 
    FROM (
      SELECT
        reviews.solutionid,
        reviews.submitdate AS validfrom,
        MIN(nextreviews.submitdate) AS validto 
      FROM reviews 
      LEFT JOIN
        reviews AS nextreviews 
        ON nextreviews.solutionid = reviews.solutionid 
        AND nextreviews.submitdate > reviews.submitdate 
      WHERE reviews.submitdate IS NOT NULL 
      GROUP BY reviews.id
    ) reviewtimeframes 
    LEFT JOIN reviews 
      ON reviews.solutionid = reviewtimeframes.solutionid 
      AND reviews.submitdate <= reviewtimeframes.validfrom 
      AND 0 = (
        SELECT COUNT(*) 
        FROM reviews AS r2 
        WHERE r2.solutionid = reviewtimeframes.solutionid 
        AND r2.submitdate <= reviewtimeframes.validfrom 
        AND (r2.islecturerreview  OR r2.issystemreview) 
        AND (
          NOT (reviews.islecturerreview OR reviews.issystemreview) 
          OR r2.submitdate > reviews.submitdate 
        )
      )
    GROUP BY reviewtimeframes.solutionid, reviewtimeframes.validfrom, reviewtimeframes.validto
  ) reviews
    ON reviews.solutionid = solutions.id AND reviews.validfrom <= s.day AND (reviews.validto IS NULL OR reviews.validto > s.day)
  LEFT JOIN audits
    ON audits.solutionid = solutions.id AND audits.creationdate <= s.day
  LEFT JOIN (SELECT TRUE) AS studentreview
    ON reviews.solutionid IS NOT NULL AND NOT reviews.issystemreview AND NOT reviews.islecturerreview
  LEFT JOIN (SELECT TRUE) AS hasactiveaudit
    ON audits.isresolved = FALSE
  LEFT JOIN (SELECT TRUE) AS published
    ON homeworks.gradespublishdate <= s.day
  LEFT JOIN (SELECT TRUE) AS insubmission
    ON homeworks.solutionstart <= s.day AND homeworks.solutionend > s.day AND solutions.id IS NULL
  LEFT JOIN (SELECT TRUE) AS didnotsubmit
    ON homeworks.solutionend <= s.day AND solutions.id IS NULL
  LEFT JOIN (SELECT TRUE) AS submitted
    ON homeworks.reviewstart > s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL
  LEFT JOIN (SELECT TRUE) AS plagiarismtrigger
    ON reviews.issystemreview AND audits.reason = 'plagiarism'
  LEFT JOIN (SELECT TRUE) AS inreview
    ON homeworks.reviewstart <= s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL
  LEFT JOIN (SELECT TRUE) AS didnotreview
    ON reviews.issystemreview AND plagiarismtrigger.bool IS NULL
  LEFT JOIN (SELECT TRUE) AS inaudit
    ON studentreview.bool AND published.bool IS NULL AND hasactiveaudit.bool
  LEFT JOIN (SELECT TRUE) AS waitingforpublish
    ON studentreview.bool AND published.bool IS NULL AND hasactiveaudit.bool IS NULL
  LEFT JOIN (SELECT TRUE) AS reviewedbylecturer
    ON reviews.islecturerreview
  LEFT JOIN (SELECT TRUE) AS reviewedbystudent
    ON studentreview.bool AND published.bool
  LEFT JOIN (SELECT TRUE) AS notstarted
    ON homeworks.solutionstart > s.day AND solutions.id IS NULL
  GROUP BY s.day, homeworks.homeworkname, homeworks.solutionstart, homeworks.solutionend, homeworks.reviewstart, homeworks.reviewend, homeworks.gradespublishdate, courses.title, courses.yearcode
  ORDER BY 1;

CREATE MATERIALIZED VIEW solutionhistorylong AS
  SELECT
    s.day, s.homeworkname, s.solutionstart, s.solutionend, s.reviewstart, s.reviewend, s.active, s.title, s.yearcode,
    UNNEST(ARRAY[ 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10 ]) AS metricid,
    UNNEST(ARRAY[ 'In Submission', 'Did Not Submit', 'Submitted', 'Plagiarism Trigger', 'In Review', 'Did Not Review', 'In Audit', 'Waiting for Publish', 'Reviewed by Lecturer', 'Reviewed by Student', 'Not Started' ]) AS metric,
    UNNEST(ARRAY[ s.insubmission, s.didnotsubmit, s.submitted, s.plagiarismtrigger, s.inreview, s.didnotreview, s.inaudit, s.waitingforpublish, s.reviewedbylecturer, s.reviewedbystudent, s.notstarted ]) AS value 
  FROM solutionhistory s
  ORDER BY 1, metricid;
