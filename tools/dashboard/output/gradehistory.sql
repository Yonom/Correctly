DROP MATERIALIZED VIEW IF EXISTS gradehistorylong;
DROP MATERIALIZED VIEW IF EXISTS gradehistory;
CREATE MATERIALIZED VIEW gradehistory AS
  SELECT
    s.day AS day,
    homeworks.homeworkname AS homeworkname,
    courses.title AS title,
    courses.yearcode AS yearcode,
    COUNT(grade100student.bool) AS grade100student,
    COUNT(grade100lecturer.bool) AS grade100lecturer,
    COUNT(grade0student.bool) AS grade0student,
    COUNT(grade0lecturer.bool) AS grade0lecturer,
    COUNT(grade0plagiarismtrigger.bool) AS grade0plagiarismtrigger,
    COUNT(grade0didnotreview.bool) AS grade0didnotreview,
    COUNT(grade0didnotsubmit.bool) AS grade0didnotsubmit
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
  LEFT JOIN (SELECT TRUE) AS grade100student
    ON studentreview.bool AND reviews.percentagegrade > 50
  LEFT JOIN (SELECT TRUE) AS grade100lecturer
    ON reviews.islecturerreview AND reviews.percentagegrade > 50
  LEFT JOIN (SELECT TRUE) AS grade0student
    ON studentreview.bool AND reviews.percentagegrade <= 50
  LEFT JOIN (SELECT TRUE) AS grade0lecturer
    ON reviews.islecturerreview AND reviews.percentagegrade <= 50
  LEFT JOIN (SELECT TRUE) AS grade0plagiarismtrigger
    ON reviews.issystemreview AND audits.reason = 'plagiarism'
  LEFT JOIN (SELECT TRUE) AS grade0didnotreview
    ON reviews.issystemreview AND grade0plagiarismtrigger.bool IS NULL
  LEFT JOIN (SELECT TRUE) AS grade0didnotsubmit
    ON homeworks.solutionend <= s.day AND solutions.id IS NULL
  GROUP BY s.day, homeworks.homeworkname, courses.title, courses.yearcode
  ORDER BY 1;

CREATE MATERIALIZED VIEW gradehistorylong AS
  SELECT
    s.day, s.homeworkname, s.title, s.yearcode,
    UNNEST(ARRAY[ 1, 2, 3, 4, 5, 6, 7 ]) AS metricid,
    UNNEST(ARRAY[ '100 - Student', '100 - Lecturer', '0 - Student', '0 - Lecturer', '0 - Plagiarism Trigger', '0 - Did Not Review', '0 - Did Not Submit' ]) AS metric,
    UNNEST(ARRAY[ s.grade100student, s.grade100lecturer, s.grade0student, s.grade0lecturer, s.grade0plagiarismtrigger, s.grade0didnotreview, s.grade0didnotsubmit ]) AS value 
  FROM gradehistory s
  ORDER BY 1, metricid;
