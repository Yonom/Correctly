import hasha from 'hasha';
import stringSimilarity from 'string-similarity';
import Levenshtein from 'levenshtein';

import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';
import { selectSolutionFiles } from '../../../services/api/database/solutions';
import { createPlagiarismSystemReview } from '../../../services/api/database/review';
import { createPlagiarismAudits } from '../../../services/api/database/audits';
import { PLAGIARISM_SIMILARITY_THRESHOLD } from '../../../utils/constants';

const checkPlagiarismAPI = async (req, res, { userId, role }) => {
  debugger;
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'POST');
  const { homeworkId } = req.body.data;

  if (homeworkId == null) {
    // error occurred (user error)
    return res.status(400).json({ code: 'plagiarism/no-homework-id' });
  }

  const solutionQuery = await selectSolutionFiles(homeworkId);
  if (solutionQuery.rows.length === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  /**
   * returns a dictionary with all duplicates, consisting of a given solutionId as key
   * and an array of all similar solution IDs as value. If
   *
   * @param c
   */
  const findDuplicates = (c) => {
    const duplicates = {};
    for (let i = 0; i < (c.hashes.length); i++) {
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
    return duplicates;
  };

  const findSimilarities = (c) => {
    // TODO:
    // - Foreach textinput calculate the distance to any other textinput
    // (- convert distance to similarity)
    // - if similarity > threshold, input key = solutionId, value = [similar solutionIds]
    const similarities = {};
    for (let i = 0; i < (c.solutionids.length); i++) {
      const localSimilarities = [];
      if (c.textinput[i] !== null) {
        for (let j = 0; j < (c.solutionids.length); j++) {
          if (c.textinput[j] !== null && j !== i) {
            const levenshteinDistance = new Levenshtein(c.textinput[i], c.textinput[j]);
            const levenshteinLength = Math.max(c.textinput[i].length, c.textinput[j].length);
            const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;
            const diceSimilarity = stringSimilarity.compareTwoStrings(c.textinput[i], c.textinput[j]) * 100;
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

    const levenshteinDistance = new Levenshtein(text1, text2);
    const levenshteinLength = Math.max(text1.length, text2.length);
    const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;
    const diceSimilarity = stringSimilarity.compareTwoStrings(text1, text2) * 100;
    return c;
  };

  const checking = { solutionids: [], files: [], hashes: [], textinput: [] };
  const solutions = solutionQuery.rows;
  solutions.forEach((e) => {
    checking.solutionids.push(e.id);
    // if solution files are attached, calculate the hashes
    if (typeof (e.solutionfiles[0]) !== 'undefined' && e.solutionfiles[0] !== null) {
      checking.files.push(e.solutionfiles[0]);
      checking.hashes.push(hasha(e.solutionfiles[0]));
      checking.textinput.push(null);
    } else {
      // TODO: calclulate some distance
      // if solution comments are attached, calculate the hashes
      checking.files.push(null);
      checking.hashes.push(null);
      if (e.solutioncomment?.length > 0) {
        checking.textinput.push(e.solutioncomment);
      }
    }
  });
  // search for dupilcates
  checking.duplicates = findDuplicates(checking);
  checking.distances = findSimilarities(checking);

  // if duplicates have been found, create a system review accordingly
  if (Object.keys(checking.duplicates).length !== 0) {
    Object.keys(checking.duplicates).forEach((key) => {
      const solutionId = key;
      const similarSolutions = checking.duplicates[key];
      const comment = `Plagiarism! 😳 Solution is similar to the folowing solution ID(s) 👉 ${similarSolutions.join(', ')}.`;
      createPlagiarismSystemReview(solutionId, comment);
      createPlagiarismAudits(solutionId);
    });
  }

  if (Object.keys(checking.similarities).length !== 0) {
    Object.keys(checking.similarities).forEach((key) => {
      const solutionId = key;
      const similarSolutions = checking.similarities[key];
      const comment = `Plagiarism! 😳 Solution is similar to the folowing solution ID(s) 👉 ${similarSolutions.join(', ')}.`;
      createPlagiarismSystemReview(solutionId, comment);
      createPlagiarismAudits(solutionId);
    });
  }


  // return empty JSON to confirm success
  return res.json({ ...solutions });
};

export default withSentry(authMiddleware(checkPlagiarismAPI));
