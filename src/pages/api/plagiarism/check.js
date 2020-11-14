import hasha from 'hasha';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';
import { selectSolutionFiles } from '../../../services/api/database/solutions';
import { createPlagiarismSystemReview } from '../../../services/api/database/review';

const checkPlagiarismAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'POST');

  debugger;
  const { homeworkId } = req.body.data;

  if (homeworkId == null) {
    // error occurred (user error)
    return res.status(400).json({ code: 'plagiarism/no-homework-id' });
  }

  const solutionQuery = await selectSolutionFiles(homeworkId);
  if (solutionQuery.rows.length === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  // TODO: Refactor
  const findDuplicates = (c) => {
    const duplicates = {};
    for (let i = 0; i < (c.hashes.length); i++) {
      const localDuplicates = [];
      for (let j = 0; j < c.hashes.length; j++) {
        if (c.hashes[i] === c.hashes[j] && i !== j) {
          localDuplicates.push(j);
        }
      }
      if (localDuplicates.length !== 0) {
        duplicates[i] = localDuplicates;
      }
    }
    return duplicates;
  };

  const checking = { solutionids: [], files: [], hashes: [] };
  const solutions = solutionQuery.rows;
  solutions.forEach((e) => {
    if (typeof (e.solutionfiles[0]) !== 'undefined') {
      checking.solutionids.push(e.id);
      checking.files.push(e.solutionfiles[0]);
      checking.hashes.push(hasha(e.solutionfiles[0]));
    }
  });
  // search for dupilcates
  checking.duplicates = findDuplicates(checking);

  // if duplicates have been found, create a system review accordingly
  if (Object.keys(checking.duplicates).length !== 0) {
    Object.keys(checking.duplicates).forEach((key) => {
      const solutionId = checking.solutionids[key];
      const comment = `Plagiarism! Solution is similar to: ${checking.solutionids[checking.duplicates[key]]}`;
      createPlagiarismSystemReview(solutionId, comment);
    });
  }

  // return empty JSON to confirm success
  return res.json({ ...solutions });
};

export default withSentry(authMiddleware(checkPlagiarismAPI));
