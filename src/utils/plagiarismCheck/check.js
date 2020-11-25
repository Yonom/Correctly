import hasha from 'hasha';
import stringSimilarity from 'string-similarity';
import Levenshtein from 'levenshtein';

import { selectSolutionFiles } from '../../services/api/database/solutions';
import { createPlagiarismSystemReview } from '../../services/api/database/review';
import { createPlagiarismAudits } from '../../services/api/database/audits';
import { PLAGIARISM_SIMILARITY_THRESHOLD, PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD } from '../constants';

/**
 * returns a dictionary with all duplicates, consisting of a given solutionId as key
 * and an array of all similar solution IDs as value. If
 *
 * @param {object} c
 */
export const findDuplicates = (c) => {
  const duplicates = {};
  for (let i = 0; i < (c.hashes.length); i++) {
    // if a file exists, check for duplicate hashes
    if (c.hashes[i] !== null) {
      const localDuplicates = [];
      for (let j = 0; j < c.hashes.length; j++) {
        if (c.hashes[i] === c.hashes[j] && i !== j) {
          localDuplicates.push(c.solutionids[j]);
        }
      }
      if (localDuplicates.length !== 0) {
        duplicates[c.solutionids[i]] = localDuplicates;
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
  for (let i = 0; i < (c.solutionids.length); i++) {
    const localSimilarities = [];
    if (c.solutioncomment[i] !== null) {
      for (let j = 0; j < (c.solutionids.length); j++) {
        if (c.solutioncomment[j] !== null && j !== i) {
          const levenshteinDistance = new Levenshtein(c.solutioncomment[i], c.solutioncomment[j]);
          const levenshteinLength = Math.max(c.solutioncomment[i].length, c.solutioncomment[j].length);
          const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;
          const diceSimilarity = stringSimilarity.compareTwoStrings(c.solutioncomment[i], c.solutioncomment[j]) * 100;
          const avgSimilarity = (levenshteinSimilarity + diceSimilarity) / 2;
          if (avgSimilarity >= PLAGIARISM_SIMILARITY_THRESHOLD) {
            localSimilarities.push(c.solutionids[j]);
          }
        }
      }
      if (localSimilarities.length !== 0) {
        similarities[c.solutionids[i]] = localSimilarities;
      }
    }
  }
  return similarities;
};

export const createChecking = (solutions) => {
  const checking = { solutionids: [], files: [], hashes: [], solutioncomment: [] };

  solutions.forEach((e) => {
    checking.solutionids.push(e.id);
    // if solution files are attached, calculate the hashes
    if (typeof (e.solutionfiles[0]) !== 'undefined' && e.solutionfiles[0] !== null) {
      checking.files.push(e.solutionfiles[0]);
      checking.hashes.push(hasha(e.solutionfiles[0]));
      checking.solutioncomment.push(null);
    } else {
      // if solution comments are attached, calculate the hashes
      checking.files.push(null);
      checking.hashes.push(null);
      // only consider the solutioncomment if length of comment is above threshold
    }
    if (e.solutioncomment?.length >= PLAGIARISM_MINIMUM_TEXT_LENGTH_THRESHOLD) {
      checking.solutioncomment.push(e.solutioncomment);
    } else {
      checking.solutioncomment.push(null);
    }
  });

  return checking;
};

export const checkPlagiarism = async (homeworkId) => {
  if (homeworkId == null) {
    return null;
  }

  const solutionQuery = await selectSolutionFiles(homeworkId);
  if (solutionQuery.rows.length === 0) {
    return null;
  }

  const solutions = solutionQuery.rows;
  const checking = createChecking(solutions);

  const allSolutionsWithPlagiarism = {};

  // search for dupilcates
  checking.duplicates = findDuplicates(checking);
  checking.solutionsAboveSimThreshold = findSimilarities(checking);

  // if duplicates have been found, create a system review accordingly
  if (Object.keys(checking.duplicates).length !== 0) {
    Object.keys(checking.duplicates).forEach((key) => {
      const solutionId = key;
      const similarSolutions = checking.duplicates[key];
      const comment = `Plagiarism! 😳 Solution is similar to the following solution ID(s) 👉 ${similarSolutions.join(', ')}.`;
      createPlagiarismSystemReview(solutionId, comment);
      createPlagiarismAudits(solutionId);
      allSolutionsWithPlagiarism[key] = 'plagiarsm';
    });
  }

  if (Object.keys(checking.solutionsAboveSimThreshold).length !== 0) {
    Object.keys(checking.solutionsAboveSimThreshold).forEach((key) => {
      const solutionId = key;
      const similarSolutions = checking.solutionsAboveSimThreshold[key];
      const comment = `Plagiarism! 😳 The solution has a similarity above ${PLAGIARISM_SIMILARITY_THRESHOLD}% with respect to the following solution ID(s) 👉 ${similarSolutions.join(', ')}.`;
      createPlagiarismSystemReview(solutionId, comment);
      createPlagiarismAudits(solutionId);
      allSolutionsWithPlagiarism[key] = 'plagiarsm';
    });
  }

  return allSolutionsWithPlagiarism;
};
