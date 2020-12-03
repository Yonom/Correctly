/* eslint-disable prefer-destructuring */
import hasha from 'hasha';
import stringSimilarity from 'string-similarity';
import Levenshtein from 'levenshtein';

import { selectSolutionFiles } from '../../services/api/database/solutions';
import { PLAGIARISM_SIMILARITY_THRESHOLD, PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD } from '../constants';

const getPairs = (arr) => {
  const res = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i; j < arr.length - 1; j++) {
      res.push([arr[i], arr[j + 1]]);
    }
  }
  return res;
};

export const getSimilaritiesForSolutions = (solutions, similarityPairs) => {
  return solutions
    .map((solution) => {
      let plagiarismId;
      const similarities = similarityPairs
        .filter((match) => match.solutions.some((sol) => solution.id === sol.solutionId))
        .map((match) => {
          plagiarismId = match.plagiarismId;
          return ({
            solution: match.solutions.filter((sol) => solution.id !== sol.solutionId)[0],
            similarity: match.similarity,
          });
        });
      return {
        solution,
        plagiarismId,
        similarities,
      };
    })
    .filter((s) => s.similarities.length > 0);
};

export const generatePlagiarismIds = (matches) => {
  const solutionMapping = {};
  matches.forEach((match) => {
    let plagiarismId;
    match.solutions.forEach((sol) => {
      if (sol.solutionId in solutionMapping) {
        plagiarismId = solutionMapping[sol.solutionId];
      }
    });
    if (plagiarismId == null) {
      plagiarismId = Math.floor(Math.random() * Math.floor(10000));
    }
    match.plagiarismId = plagiarismId;
    match.solutions.forEach((sol) => {
      solutionMapping[sol.solutionId] = plagiarismId;
    });
  });
  return matches;
};

/**
 * returns a dictionary with all duplicates, consisting of a given solutionId as key
 * and an array of all similar solution IDs as value. If
 *
 * @param {object} c
 */
export const findDuplicates = (c) => {
  const matches = [];
  const pairs = getPairs(c);
  for (const [solution1, solution2] of pairs) {
    // if a file exists, check for duplicate hashes
    if (solution1.hash != null && solution2.hash != null) {
      if (solution1.hash === solution2.hash) {
        matches.push({
          similarity: 1,
          solutions: [solution1, solution2],
        });
      }
    }
  }
  return matches;
};

export const findSimilarities = (c) => {
  // - Foreach solutioncomment calculate the distance to any other solutioncomment
  // (- convert distance to similarity)
  // - if similarity > threshold, input key = solutionId, value = [similar solutionIds]
  const matches = [];

  const pairs = getPairs(c);
  for (const [solution1, solution2] of pairs) {
    // if a file exists, check for duplicate hashes
    if (solution1.solutioncomment != null && solution2.solutioncomment != null) {
      const levenshteinDistance = new Levenshtein(solution1.solutioncomment, solution2.solutioncomment);
      const levenshteinLength = Math.max(solution1.solutioncomment.length, solution2.solutioncomment.length);
      const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;

      const diceSimilarity = stringSimilarity.compareTwoStrings(solution1.solutioncomment, solution2.solutioncomment) * 100;

      const avgSimilarity = (levenshteinSimilarity + diceSimilarity) / 2;
      if (avgSimilarity >= PLAGIARISM_SIMILARITY_THRESHOLD) {
        matches.push({
          similarity: avgSimilarity,
          solutions: [solution1, solution2],
        });
      }
    }
  }
  return matches;
};

export const createChecking = (solutions) => {
  const checking = [];

  solutions.forEach((e) => {
    const obj = {
      solutionId: e.id,
      homeworkId: e.homeworkid,
      userId: e.userid,
      firstName: e.firstname,
      lastName: e.lastname,
    };

    // if solution files are attached, calculate the hashes
    if (e.solutionfiles?.[0] != null) {
      obj.hash = hasha(e.solutionfiles[0]);
    } else {
      // if solution comments are attached, calculate the hashes TODO(?)
    }
    // only consider the solutioncomment if length of comment is above threshold
    if (e.solutioncomment?.length >= PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD) {
      obj.solutioncomment = e.solutioncomment.toUpperCase().replace(/\s\s+/g, ' ');
    }
    checking.push(obj);
  });

  return checking;
};

const createReviewComment = (message, similarities, plagiarismId) => {
  return `${message}:

${
  similarities
    .map((s) => `- ${s.solution.firstName} ${s.solution.lastName} https://correctly.frankfurt.school/homeworks/${s.solution.homeworkId}/${s.solution.userId} (Similarity: ${s.similarity.toFixed(2)}%)`).join('\n')
}

Plagiarism Case ID: ${plagiarismId}`;
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
  const withPlagIds = generatePlagiarismIds([...duplicates, ...solutionsAboveSimThreshold]);
  const solutionSimilarities = getSimilaritiesForSolutions(solutions, withPlagIds);
  solutionSimilarities.forEach(({ solution, plagiarismId, similarities }) => {
    const comment = createReviewComment(`Plagiarism! 😳 The solution has a similarity above ${PLAGIARISM_SIMILARITY_THRESHOLD}% with respect to the following solutions`, similarities, plagiarismId);
    allSolutionsWithPlagiarism.push([solution.id, comment, plagiarismId]);
  });

  return allSolutionsWithPlagiarism;
};
