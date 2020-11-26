// eslint-disable-next-line import/no-unresolved
import fs from 'fs/promises';

const indent = (str) => {
  return str.split('\n').join('\n  ');
};

const toView = (name, statement) => {
  return `CREATE MATERIALIZED VIEW ${name} AS
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
GROUP BY ${this.groupbyColumns.join(', ')}`;

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

  save(filename) {
    fs.writeFile(`output/${filename}.sql`,
      `DROP MATERIALIZED VIEW IF EXISTS ${filename}long;
DROP MATERIALIZED VIEW IF EXISTS ${filename};
${toView(filename, this.constructWide())}
${toView(`${filename}long`, this.constructLong(filename))}`);
  }

  fromDays() {
    this.from = `(
  SELECT series.day + IF(series.day = NOW()::DATE, NOW()::TIME, TIME '23:59:59') AS day 
  FROM (
    SELECT GENERATE_SERIES(
      TIMESTAMP '2020-11-11', 
      now()::TIMESTAMP + INTERVAL '3 days', 
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

  addWideOnlyGradeMetric(name, formula) {
    this.addGradeMetric(name, formula);
    this.selectColumns.push(`AVG(${name}.grade) AS ${name}`);
  }

  addBooleanMetric(name, formula) {
    this.joinTable(`(SELECT TRUE) AS ${name}`, formula);
  }

  addGradeMetric(name, formula) {
    this.joinTable(`(SELECT UNNEST(ARRAY[0, 100, NULL]) AS grade) AS ${name}`, formula);
  }
}

const homeworks = () => {
  const statement = new SQLStatement();
  statement.fromDays();
  statement.joinTable('homeworks');
  statement.joinTableCourses();

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
  statement.joinTable('homeworks');
  statement.addDimention('homeworks.homeworkname');
  statement.addDimention('homeworks.solutionstart');
  statement.addDimention('homeworks.solutionend');
  statement.addDimention('homeworks.reviewstart');
  statement.addDimention('homeworks.reviewend');
  statement.addDimention('homeworks.solutionstart <= s.day AND (homeworks.gradespublishdate IS NULL OR homeworks.gradespublishdate > s.day)', 'homeworks.gradespublishdate', 'active');

  statement.joinTableCourses();
  statement.joinTable('attends', 'attends.courseid = homeworks.courseid AND attends.isstudent ');
  statement.joinTable('solutions', 'solutions.userid = attends.userid AND solutions.homeworkid = homeworks.id AND solutions.submitdate <= s.day');
  statement.joinTableReviews('reviews.solutionid = solutions.id AND reviews.validfrom <= s.day AND (reviews.validto IS NULL OR reviews.validto > s.day)');
  statement.joinTable('audits', 'audits.solutionid = solutions.id AND audits.creationdate <= s.day');

  statement.addBooleanMetric('studentreview', 'reviews.solutionid IS NOT NULL AND NOT reviews.issystemreview AND NOT reviews.islecturerreview');

  statement.addWideOnlyCountMetric('hasactiveaudit', 'audits.isresolved = FALSE');
  statement.addWideOnlyCountMetric('published', 'homeworks.gradespublishdate <= s.day');

  statement.addCountMetric(1, 'In Submission', 'homeworks.solutionstart <= s.day AND homeworks.solutionend > s.day AND solutions.id IS NULL');
  statement.addCountMetric(2, 'Did Not Submit', 'homeworks.solutionend <= s.day AND solutions.id IS NULL'); // no solution
  statement.addCountMetric(3, 'Submitted', 'homeworks.reviewstart > s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL');
  statement.addCountMetric(4, 'Plagiarism Trigger', 'reviews.issystemreview AND audits.reason = \'plagiarism\''); // system review - audit 'plagiarism'
  statement.addCountMetric(5, 'In Review', 'homeworks.reviewstart <= s.day AND solutions.id IS NOT NULL AND reviews.solutionid IS NULL'); // waiting for review or audit 'missing-review-submission
  statement.addCountMetric(6, 'Did Not Review', 'reviews.issystemreview AND plagiarismtrigger.bool IS NULL'); // system review - audit 'did-not-submit-review'
  statement.addCountMetric(7, 'In Audit', 'studentreview.bool AND published.bool IS NULL AND hasactiveaudit.bool'); // in audit 'samplesize, threshold'
  statement.addCountMetric(7, 'Waiting for Publish', 'studentreview.bool AND published.bool IS NULL AND hasactiveaudit.bool IS NULL'); // waiting
  statement.addCountMetric(8, 'Reviewed by Lecturer', 'reviews.islecturerreview'); // lecturer review
  statement.addCountMetric(9, 'Reviewed by Student', 'studentreview.bool AND published.bool'); // published
  statement.addCountMetric(10, 'Not Started', 'homeworks.solutionstart > s.day AND solutions.id IS NULL');

  return statement;
};

const grades = () => {
  const statement = new SQLStatement();
  statement.fromDays();
  statement.joinTable('homeworks');
  statement.addDimention('homeworks.homeworkname');

  statement.joinTableCourses();
  statement.joinTable('attends', 'attends.courseid = homeworks.courseid AND attends.isstudent ');
  statement.joinTable('solutions', 'solutions.userid = attends.userid AND solutions.homeworkid = homeworks.id AND solutions.submitdate <= s.day');
  statement.joinTableReviews('reviews.solutionid = solutions.id AND reviews.validfrom <= s.day AND (reviews.validto IS NULL OR reviews.validto > s.day)');
  statement.joinTable('audits', 'audits.solutionid = solutions.id AND audits.creationdate <= s.day');

  statement.addBooleanMetric('studentreview', 'reviews.solutionid IS NOT NULL AND NOT reviews.issystemreview AND NOT reviews.islecturerreview');

  statement.addCountMetric(1, '100 - Student', 'studentreview.bool AND reviews.percentagegrade > 50');
  statement.addCountMetric(2, '100 - Lecturer', 'reviews.islecturerreview AND reviews.percentagegrade > 50');
  statement.addCountMetric(3, '0 - Student', 'studentreview.bool AND reviews.percentagegrade <= 50');
  statement.addCountMetric(4, '0 - Lecturer', 'reviews.islecturerreview AND reviews.percentagegrade <= 50');
  statement.addCountMetric(5, '0 - Plagiarism Trigger', 'reviews.issystemreview AND audits.reason = \'plagiarism\'');
  statement.addCountMetric(6, '0 - Did Not Review', 'reviews.issystemreview AND grade0plagiarismtrigger.bool IS NULL');
  statement.addCountMetric(7, '0 - Did Not Submit', 'homeworks.solutionend <= s.day AND solutions.id IS NULL');

  return statement;
};

homeworks().save('homeworkhistory');
solutions().save('solutionhistory');
grades().save('gradehistory');
