/* eslint-disable prefer-destructuring */
import hasha from 'hasha';
import stringSimilarity from 'string-similarity';
import Levenshtein from 'levenshtein';

import { selectSolutionFiles } from '../../services/api/database/solutions';
import { PLAGIARISM_SIMILARITY_THRESHOLD, PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD } from '../constants';

/**
 * returns a dictionary with all duplicates, consisting of a given solutionId as key
 * and an array of all similar solution IDs as value. If
 *
 * @param {object} c
 */
export const findDuplicates = (c) => {
  const duplicates = {};
  for (let i = 0; i < (c.length); i++) {
    // if a file exists, check for duplicate hashes
    if (c[i].hash !== null) {
      const localDuplicates = [];
      for (let j = 0; j < c.length; j++) {
        if (c[i].hash === c[j].hash && i !== j) {
          localDuplicates.push(c[j].solutionId);
        }
      }
      if (localDuplicates.length !== 0) {
        duplicates[c[i].solutionId] = localDuplicates;
      }
    }
  }
  return duplicates;
};

export const findSimilarities = (c) => {
  // - Foreach solutioncomment calculate the distance to any other solutioncomment
  // (- convert distance to similarity)
  // - if similarity > threshold, input key = solutionId, value = [similar solutionIds]
  const similarities = {};
  for (let i = 0; i < (c.length); i++) {
    const localSimilarities = [];
    if (c[i].solutioncomment !== null) {
      for (let j = 0; j < (c.length); j++) {
        if (c[j].solutioncomment !== null && j !== i) {
          const levenshteinDistance = new Levenshtein(c[i].solutioncomment, c[j].solutioncomment);
          const levenshteinLength = Math.max(c[i].solutioncomment.length, c[j].solutioncomment.length);
          const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;

          const diceSimilarity = stringSimilarity.compareTwoStrings(c[i].solutioncomment, c[j].solutioncomment) * 100;

          const avgSimilarity = (levenshteinSimilarity + diceSimilarity) / 2;
          if (avgSimilarity >= PLAGIARISM_SIMILARITY_THRESHOLD) {
            localSimilarities.push(c[j].solutionId);
          }
        }
      }
      if (localSimilarities.length !== 0) {
        similarities[c[i].solutionId] = localSimilarities;
      }
    }
  }
  return similarities;
};

export const createChecking = (solutions) => {
  const checking = [];

  solutions.forEach((e) => {
    const obj = {
      solutionId: e.id,
      solutioncomment: null,
      hash: null,
    };

    // if solution files are attached, calculate the hashes
    if (e.solutionfiles[0] != null) {
      obj.hash = hasha(e.solutionfiles[0]);
    } else {
      // if solution comments are attached, calculate the hashes TODO(?)
    }
    // only consider the solutioncomment if length of comment is above threshold
    if (e.solutioncomment?.length >= PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD) {
      obj.solutioncomment = e.solutioncomment;
    }
    checking.push(obj);
  });

  return checking;
};

const createReviewComment = (message, solutions, solutionIds) => {
  return `${message}:

${
  solutionIds
    .map((sid) => solutions.filter((sol) => sol.id === sid)[0])
    .map((s) => `- https://correctly.frankfurt.school/homeworks/${s.homeworkid}/${s.userid}`).join('\n')
}`;
};

export const checkPlagiarism = async (homeworkId) => {
  const solutionQuery = await selectSolutionFiles(homeworkId);
  if (solutionQuery.rows.length === 0) {
    return null;
  }

  const solutions = solutionQuery.rows;
  const checking = createChecking(solutions);

  const allSolutionsWithPlagiarism = [];

  // search for dupilcates
  const duplicates = findDuplicates(checking);
  const solutionsAboveSimThreshold = findSimilarities(checking);

  // if duplicates have been found, create a system review accordingly
  Object.keys(duplicates).forEach((key) => {
    const similarSolutions = duplicates[key];
    const comment = createReviewComment('Plagiarism! 😳 Solution is similar to the following solution ID(s)', solutions, similarSolutions);
    allSolutionsWithPlagiarism.push([key, comment]);
  });

  Object.keys(solutionsAboveSimThreshold).forEach((key) => {
    const similarSolutions = solutionsAboveSimThreshold[key];
    if (key in duplicates) {
      for (let i = 0; i < allSolutionsWithPlagiarism.length; i++) {
        if (allSolutionsWithPlagiarism[i][0] === key) {
          const comment = createReviewComment(`\n😡👮‍♂️ and the solution has a similarity above ${PLAGIARISM_SIMILARITY_THRESHOLD}% with respect to the following solution ID(s)`, solutions, similarSolutions);
          allSolutionsWithPlagiarism[i][1] = allSolutionsWithPlagiarism[i][1].slice(0, -1);
          allSolutionsWithPlagiarism[i][1] += comment;
        }
      }
    } else {
      const comment = createReviewComment(`Plagiarism! 😳 The solution has a similarity above ${PLAGIARISM_SIMILARITY_THRESHOLD}% with respect to the following solution ID(s)`, solutions, similarSolutions);
      allSolutionsWithPlagiarism.push([key, comment]);
    }
  });

  return allSolutionsWithPlagiarism;
};
