DROP MATERIALIZED VIEW IF EXISTS homeworkhistorylong;
DROP MATERIALIZED VIEW IF EXISTS homeworkhistory;
CREATE MATERIALIZED VIEW homeworkhistory AS
  SELECT
    s.day AS day,
    courses.title AS title,
    courses.yearcode AS yearcode,
    COUNT(insubmission.bool) AS insubmission,
    COUNT(inreview.bool) AS inreview,
    COUNT(published.bool) AS published,
    COUNT(notstarted.bool) AS notstarted,
    COUNT(submitted.bool) AS submitted,
    COUNT(inaudit.bool) AS inaudit
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
  LEFT JOIN (SELECT TRUE) AS submissiondone
    ON homeworks.solutionend <= s.day
  LEFT JOIN (SELECT TRUE) AS reviewdone
    ON homeworks.reviewend <= s.day
  LEFT JOIN (SELECT TRUE) AS insubmission
    ON homeworks.solutionstart <= s.day AND homeworks.solutionend > s.day
  LEFT JOIN (SELECT TRUE) AS inreview
    ON homeworks.reviewstart <= s.day AND homeworks.reviewend > s.day
  LEFT JOIN (SELECT TRUE) AS published
    ON homeworks.gradespublishdate <= s.day
  LEFT JOIN (SELECT TRUE) AS notstarted
    ON homeworks.solutionstart > s.day
  LEFT JOIN (SELECT TRUE) AS submitted
    ON submissiondone.bool AND inreview.bool IS NULL AND reviewdone.bool IS NULL
  LEFT JOIN (SELECT TRUE) AS inaudit
    ON reviewdone.bool AND published.bool IS NULL
  GROUP BY s.day, courses.title, courses.yearcode
  ORDER BY 1;

CREATE MATERIALIZED VIEW homeworkhistorylong AS
  SELECT
    s.day, s.title, s.yearcode,
    UNNEST(ARRAY[ 1, 3, 5, 6, 2, 4 ]) AS metricid,
    UNNEST(ARRAY[ 'In Submission', 'In Review', 'Published', 'Not Started', 'Submitted', 'In Audit' ]) AS metric,
    UNNEST(ARRAY[ s.insubmission, s.inreview, s.published, s.notstarted, s.submitted, s.inaudit ]) AS value 
  FROM homeworkhistory s
  ORDER BY 1, metricid;
