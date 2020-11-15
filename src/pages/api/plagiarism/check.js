import hasha from 'hasha';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';
import { selectSolutionFiles } from '../../../services/api/database/solutions';
import { createPlagiarismSystemReview } from '../../../services/api/database/review';
import { createPlagiarismAudits } from '../../../services/api/database/audits';

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
        console.log(`A solution comment has been found for: ${e.id}`);
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
  console.log(checking);

  // return empty JSON to confirm success
  return res.json({ ...solutions });
};

export default withSentry(authMiddleware(checkPlagiarismAPI));
