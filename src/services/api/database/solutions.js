import { databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/constants';

// select all solutions of a homework
export const selectSolutions = async (homeworkId) => {
  const queryText = `SELECT id, userid
  FROM solutions
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionFiles = async (homeworkId) => {
  const queryText = `SELECT id, homeworkid, users.userid, users.firstname, users.lastname, solutionfiles, solutioncomment
  FROM solutions
  JOIN users ON solutions.userid = users.userid
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionsAndGrades = async (homeworkId) => {
  const queryText = `SELECT users.firstname, users.lastname,  solutions.id, solutions.userid, AVG(percentagegrade) AS percentageGrade, audits.isresolved = FALSE AS hasunresolvedaudit
  FROM solutions
  LEFT JOIN audits ON audits.solutionid = solutions.id
  ${SQL_FOR_PERCENTAGE_GRADE}
  JOIN users ON users.userid = solutions.userid
  WHERE homeworkid = $1
  GROUP BY solutions.id, users.*, audits.*
  ORDER BY users.firstname, users.lastname, users.userid`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionFileForUser = async (solutionId, userId, isSuperuser) => {
  const queryText = `
    SELECT solutions.solutionfiles, solutions.solutionfilenames, solutions.solutioncomment
    FROM solutions
    JOIN homeworks ON homeworks.id = solutions.homeworkid
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    LEFT JOIN reviews ON reviews.solutionid = solutions.id AND reviews.userid = $2
    WHERE solutions.id = $1 
    AND users.isactive AND users.isemailverified
    AND (
      (reviews.userid = $2 AND NOT reviews.issubmitted) OR
      solutions.userid = $2 OR
      attends.userid = $2 OR
      $3
    )
  `;
  const params = [solutionId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

export const selectSolutionForUser = async (solutionId, userId, isSuperuser) => {
  const queryText = `
    SELECT solutions.id
    FROM solutions
    JOIN homeworks ON homeworks.id = solutions.homeworkid
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    WHERE solutions.id = $1 
    AND users.isactive AND users.isemailverified
    AND (
      attends.userid = $2 OR $3
    )
  `;
  const params = [solutionId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

export const selectSolutionsForHomeworkAndUser = async (homeworkId, requestedUserId, userId, isSuperuser) => {
  const queryText = `
  SELECT solutions.id, solutions.solutionfilenames, solutions.solutioncomment, AVG(percentagegrade) AS percentageGrade, gradespublished, homeworks.hasdistributedreviews
  FROM solutions
  ${SQL_FOR_PERCENTAGE_GRADE}
  JOIN homeworks ON homeworks.id = solutions.homeworkid
  LEFT JOIN attends ON (
    attends.courseid = homeworks.courseid AND
    (attends.islecturer OR attends.ismodulecoordinator) AND
    attends.userid = $3
  )
  LEFT JOIN users ON users.userid = $2
  WHERE
    users.isactive AND
    users.isemailverified AND
    homeworkid = $1 AND
    solutions.userid = $2 AND
    (solutions.userid = $3 or attends.userid = $3 or $4) 
  GROUP BY solutions.*, homeworks.*;
  `;
  const params = [homeworkId, requestedUserId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

export const selectUsersWithoutSolution = async (homeworkId) => {
  const queryText = `
    SELECT attends.userid, firstname, lastname
    FROM attends
    JOIN users ON users.userid = attends.userid
    JOIN courses on attends.courseid = courses.id
    JOIN homeworks on homeworks.courseid = courses.id
    WHERE homeworks.id = $1 AND attends.isstudent AND (
      SELECT COUNT(*)
      FROM solutions
      WHERE solutions.userid = attends.userid AND solutions.homeworkid = $1
    ) = 0
    ORDER BY users.firstname, users.lastname, users.userid
  `;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionsAndReviewsForHomeworkExport = async (homeworkId) => {
  const queryText = `
  select 
    homeworks.id,
    users.userid,
    homeworks.homeworkname, 
    courses.title,
    courses.yearcode, 
    users.firstname, 
    users.lastname, 
    homeworks.maxreachablepoints,
    solutions.solutioncomment as solution,
    AVG(reviews.percentagegrade) * homeworks.maxreachablepoints::float /100. as actualpointsearned,
    AVG(reviews.percentagegrade) as percentagegrade,
    if(COUNT(currentreview.id) = 0, '', string_agg(if(currentreview.issystemreview, 'SYSTEM', concat(reviewer.firstname, ' ', reviewer.lastname)), E'\\n')) as reviewers, 
    if(COUNT(currentreview.id) = 0, '', string_agg(concat('---- Review of ', if(currentreview.issystemreview, 'SYSTEM', concat(reviewer.firstname, ' ', reviewer.lastname)), E': ----\\n', if(currentreview.issubmitted, currentreview.reviewcomment, '(not submitted)')), E'\\n\\n')) as reviewcomments,
    if(COUNT(currentreview.id) = 0, '', string_agg(concat('Review of ', if(currentreview.issystemreview, 'SYSTEM', concat(reviewer.firstname, ' ', reviewer.lastname)), E': ', if(currentreview.issubmitted, (currentreview.percentagegrade * homeworks.maxreachablepoints::float / 100.)::string, '(not submitted)')), E'\\n')) as reviewgrades
  from solutions 
  join homeworks on homeworks.id = solutions.homeworkid
  join courses on homeworks.courseid = courses.id
  join users on solutions.userid = users.userid
  left join (
    select * from reviews
    order by (reviews.issystemreview or reviews.islecturerreview) desc, reviews.submitdate desc
  ) as currentreview on solutions.id = currentreview.solutionid
  left join users as reviewer on reviewer.userid = currentreview.userid
  LEFT JOIN reviews ON solutions.id = reviews.solutionid AND reviews.issubmitted AND 0 = (
    SELECT COUNT(*)
    FROM reviews AS r2 
    WHERE r2.solutionid = solutions.id 
    AND (r2.islecturerreview OR r2.issystemreview)
    AND (
    NOT (reviews.islecturerreview OR reviews.issystemreview)
    OR r2.submitdate > reviews.submitdate
    )
  )
  where homeworks.id = $1
  group by solutions.*, homeworks.*, courses.*, users.*
  order by users.firstname, users.lastname, users.userid
  `;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectHomeworkSolutionAllowedFormatsForSolutionAndUser = async (homeworkId, userId) => {
  const queryText = `
    SELECT homeworks.solutionallowedformats
    FROM attends
    JOIN users ON users.userid = attends.userid
    JOIN courses on attends.courseid = courses.id
    JOIN homeworks on homeworks.courseid = courses.id
    WHERE homeworks.id = $1 
    AND attends.userid = $2 
    AND attends.isstudent 
    AND users.isactive AND users.isemailverified
    AND homeworks.solutionstart <= NOW()
    AND homeworks.solutionend > NOW()
  `;
  const params = [homeworkId, userId];
  const res = await databaseQuery(queryText, params);
  if (res.rows.length === 0) return null;
  return res.rows[0].solutionallowedformats;
};

export const insertSolution = async (userId, homeworkId, solutionFile, solutionFilename, solutionComment) => {
  const queryText = `
    INSERT INTO solutions(userid, homeworkid, solutionfiles, solutionfilenames, submitdate, solutioncomment)
    VALUES($1, $2, $3, $4, Now(), $5)
    ON CONFLICT (userid, homeworkid)
    DO UPDATE SET solutionfiles = $3, solutionfilenames = $4, submitdate = NOW(), solutioncomment = $5
  `;
  const params = [userId, homeworkId, [solutionFile], [solutionFilename], solutionComment];
  return await databaseQuery(queryText, params);
};
