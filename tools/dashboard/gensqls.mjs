// eslint-disable-next-line import/no-unresolved
import fs from 'fs/promises';

const indent = (str) => {
  return str.split('\n').join('\n  ');
};

const toView = (name, statement, type = 'MATERIALIZED VIEW') => {
  return `CREATE ${type} ${name} AS
  ${indent(statement)};
`;
};

class SQLStatement {
  constructor() {
    this.selectColumns = [];
    this.from = '';
    this.joins = [];
    // this.whereClause = '';
    this.groupbyColumns = [];
    this.orderbyClause = null;
    this.metrics = [];
    this.dimentionColumns = [];
  }

  constructWide() {
    const groupByClause = this.groupbyColumns.length && `
GROUP BY ${[...new Set(this.groupbyColumns)].join(', ')}`;

    return `SELECT
  ${this.selectColumns.join(',\n  ')}
FROM ${this.from}
${this.joins.join('\n')}${groupByClause}
${this.orderbyClause}`;
  }

  constructLong(name) {
    return `SELECT
  ${this.dimentionColumns.join(', ')},
  UNNEST(ARRAY[ ${this.metrics.map((m) => `${m.id}`).join(', ')} ]) AS metricid,
  UNNEST(ARRAY[ ${this.metrics.map((m) => `'${m.name}'`).join(', ')} ]) AS metric,
  UNNEST(ARRAY[ ${this.metrics.map((m) => `s.${m.adjustedName}`).join(', ')} ]) AS value 
FROM ${name} s
${this.orderbyClause}, metricid`;
  }

  // eslint-disable-next-line class-methods-use-this
  constructTodayAndYesterday(name) {
    return `SELECT 
  ${this.selectColumns.map((c) => `${name}.${c.split(' AS ')[1]}`).join(',\n  ')}
FROM ${name}
WHERE (
  NOW()::DATE = day::DATE 
  OR (now() - interval '1 day')::DATE = day::DATE
)`;
  }

  async save(filename) {
    await fs.appendFile('output.sql',
      `DROP VIEW IF EXISTS ${filename}today;
DROP VIEW IF EXISTS ${filename}long;
DROP MATERIALIZED VIEW IF EXISTS ${filename};
${toView(`${filename}`, this.constructWide())}
${toView(`${filename}long`, this.constructLong(filename), 'VIEW')}
${toView(`${filename}today`, this.constructTodayAndYesterday(filename), 'VIEW')}`);
  }

  fromDays() {
    this.from = `(
  SELECT series.day + IF(series.day = NOW()::DATE, NOW()::TIME, TIME '23:59:59') AS day 
  FROM (
    SELECT GENERATE_SERIES(
      TIMESTAMP '2020-11-11', 
      now()::TIMESTAMP, 
      INTERVAL '1 day'
    )::DATE AS day 
  ) series 
) s`;
    this.addDimention('s.day');
    this.orderbyClause = 'ORDER BY 1';
  }

  addDimention(formula, deps, name) {
    deps = deps ?? formula;
    name = name ?? formula.split('.')[1];

    this.selectColumns.push(`${formula} AS ${name}`);
    if (deps) {
      this.groupbyColumns.push(deps);
    }
    this.dimentionColumns.push(`s.${name}`);
  }

  joinTable(table, on = 'TRUE') {
    this.joins.push(
      `LEFT JOIN ${table}\n  ON ${on}`,
    );
  }

  joinTableCourses() {
    this.joinTable('courses', 'homeworks.courseid = courses.id');
    this.addDimention('courses.title');
    this.addDimention('courses.yearcode');
  }

  joinTableHomeworks() {
    this.joinTable('homeworks');
    this.addDimention('homeworks.homeworkname');
    this.addDimention('(homeworks.solutionend::DATE = NOW()::DATE OR homeworks.reviewend::DATE = NOW()::DATE)', null, 'isdeadlinetoday');
    this.groupbyColumns.push('homeworks.solutionend');
    this.groupbyColumns.push('homeworks.reviewend');
  }

  joinTableReviews(where) {
    this.joinTable(`(
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
) reviews`,
    where);
  }

  joinTablesAttendsSolutionsReviewsAudits() {
    this.joinTable('attends', 'attends.courseid = homeworks.courseid AND attends.isstudent ');
    this.joinTable('solutions', 'solutions.userid = attends.userid AND solutions.homeworkid = homeworks.id AND solutions.submitdate <= s.day');
    this.joinTableReviews('reviews.solutionid = solutions.id AND reviews.validfrom <= s.day AND (reviews.validto IS NULL OR reviews.validto > s.day)');
    this.joinTable('audits', 'audits.solutionid = solutions.id AND audits.creationdate <= s.day');
  }

  addCountMetric(id, name, formula) {
    let adjustedName = name.toLowerCase()
      .split(' ')
      .join('')
      .split('-')
      .join('');
    if (adjustedName[0] === '0' || adjustedName[0] === '1') {
      adjustedName = `grade${adjustedName}`;
    }
    this.addWideOnlyCountMetric(adjustedName, formula);
    this.metrics.push({ id, name, adjustedName });
  }

  addWideOnlyCountMetric(name, formula) {
    this.addBooleanMetric(name, formula);
    this.selectColumns.push(`COUNT(${name}.bool) AS ${name}`);
  }

  addBooleanMetric(name, formula) {
    this.joinTable(`(SELECT TRUE) AS ${name}`, formula);
  }
}

const homeworks = () => {
  const statement = new SQLStatement();
  statement.fromDays();
  statement.joinTableHomeworks();
  statement.joinTableCourses();

  // homework info
  statement.addDimention('homeworks.solutionstart');
  statement.addDimention('homeworks.solutionend');
  statement.addDimention('homeworks.reviewstart');
  statement.addDimention('homeworks.reviewend');
  statement.addDimention('homeworks.solutionstart <= s.day AND (homeworks.gradespublishdate IS NULL OR homeworks.gradespublishdate > s.day)', 'homeworks.gradespublishdate', 'isactive');

  statement.addBooleanMetric('submissiondone', 'homeworks.solutionend <= s.day');
  statement.addBooleanMetric('reviewdone', 'homeworks.reviewend <= s.day');

  statement.addCountMetric(1, 'In Submission', 'homeworks.solutionstart <= s.day AND homeworks.solutionend > s.day');
  statement.addCountMetric(3, 'In Review', 'homeworks.reviewstart <= s.day AND homeworks.reviewend > s.day');
  statement.addCountMetric(5, 'Published', 'homeworks.gradespublishdate <= s.day');
  statement.addCountMetric(6, 'Not Started', 'homeworks.solutionstart > s.day');

  statement.addCountMetric(2, 'Submitted', 'submissiondone.bool AND inreview.bool IS NULL AND reviewdone.bool IS NULL');
  statement.addCountMetric(4, 'In Audit', 'reviewdone.bool AND published.bool IS NULL');
  return statement;
};

const solutions = () => {
  const statement = new SQLStatement();
  statement.fromDays();
  statement.joinTableHomeworks();
  statement.joinTableCourses();
  statement.joinTablesAttendsSolutionsReviewsAudits();

  statement.addBooleanMetric('studentreview', 'reviews.solutionid IS NOT NULL AND NOT reviews.issystemreview AND NOT reviews.islecturerreview');

  statement.addCountMetric(3, 'In Audit', 'audits.isresolved = FALSE');
  statement.addWideOnlyCountMetric('published', 'homeworks.gradespublishdate <= s.day');

  statement.addCountMetric(1, 'In Submission', 'homeworks.solutionstart <= s.day AND homeworks.solutionend > s.day AND solutions.id IS NULL');
  statement.addWideOnlyCountMetric('didnotsubmit', 'homeworks.solutionend <= s.day AND solutions.id IS NULL'); // no solution
  statement.addWideOnlyCountMetric('submitted', 'homeworks.reviewstart > s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL');
  // statement.addWideOnlyCountMetric('plagiarismtrigger', 'reviews.issystemreview AND audits.reason = \'plagiarism\''); // system review - audit 'plagiarism'
  statement.addCountMetric(2, 'In Review', 'homeworks.reviewstart <= s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL'); // waiting for review or audit 'missing-review-submission
  statement.addWideOnlyCountMetric('didnotreview', 'reviews.issystemreview'); // system review - audit 'did-not-submit-review'
  statement.addWideOnlyCountMetric('otheraudit', 'studentreview.bool AND published.bool IS NULL AND inaudit.bool'); // in audit 'samplesize, threshold'
  statement.addCountMetric(4, 'Waiting For Publish', 'studentreview.bool AND published.bool IS NULL AND inaudit.bool IS NULL'); // waiting
  statement.addWideOnlyCountMetric('reviewedbylecturer', 'reviews.islecturerreview'); // lecturer review
  statement.addWideOnlyCountMetric('reviewedbystudent', 'studentreview.bool AND published.bool'); // published
  statement.addWideOnlyCountMetric('notstarted', 'homeworks.solutionstart > s.day AND solutions.id IS NULL');

  return statement;
};

const grades = () => {
  const statement = new SQLStatement();
  statement.fromDays();
  statement.joinTableHomeworks();
  statement.joinTableCourses();
  statement.joinTablesAttendsSolutionsReviewsAudits();

  statement.addBooleanMetric('studentreview', 'reviews.solutionid IS NOT NULL AND NOT reviews.issystemreview AND NOT reviews.islecturerreview');

  statement.addCountMetric(1, '100 - Student', 'studentreview.bool AND reviews.percentagegrade > 50');
  statement.addCountMetric(2, '100 - Lecturer', 'reviews.islecturerreview AND reviews.percentagegrade > 50');
  statement.addCountMetric(3, '0 - Student', 'studentreview.bool AND reviews.percentagegrade <= 50');
  statement.addCountMetric(4, '0 - Lecturer', 'reviews.islecturerreview AND reviews.percentagegrade <= 50');
  // statement.addCountMetric(5, '0 - Plagiarism Trigger', 'reviews.issystemreview AND audits.reason = \'plagiarism\'');
  statement.addCountMetric(6, '0 - Did Not Review', 'reviews.issystemreview');
  statement.addCountMetric(7, '0 - Did Not Submit', 'homeworks.solutionend <= s.day AND solutions.id IS NULL');

  return statement;
};

const saveSqls = async () => {
  await homeworks().save('homeworkhistory');
  await solutions().save('solutionhistory');
  await grades().save('gradehistory');
};

fs.rm('output.sql').then(saveSqls).catch(saveSqls);
