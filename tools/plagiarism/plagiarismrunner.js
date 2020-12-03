import fs from 'fs/promises';
import { createChecking, findDuplicates, findSimilarities, generatePlagiarismIds } from '../../src/utils/plagiarismCheck/check';

import { solutions as allSolutions } from './solutions.json';

const groupBy = function groupBy(xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const getMatchesForSolutionSimilarities = (sims) => {
  const plagIdCollections = groupBy(generatePlagiarismIds(sims), 'plagiarismId');
  const result = {};
  for (const [plagiarismId, matches] of Object.entries(plagIdCollections)) {
    const urls = {};
    matches.forEach((match) => {
      match.solutions.forEach((sol) => {
        const existingSim = urls[sol.solutionId] ? urls[sol.solutionId].similarity : 0;
        urls[sol.solutionId] = {
          homeworkId: sol.homeworkId,
          userId: sol.userId,
          firstName: sol.firstName,
          lastName: sol.lastName,
          similarity: Math.max(existingSim, match.similarity),
        };
      });
    });
    result[plagiarismId] = Object.values(urls).sort((url1, url2) => url2.similarity - url1.similarity)
      .map(({ homeworkId, userId, firstName, lastName, similarity }) => {
        return `- ${firstName} ${lastName} https://correctly.frankfurt.school/homeworks/${homeworkId}/${userId} (Similarity: ${similarity.toFixed(2)}%)`;
      });
  }
  return Object.values(result).length > 0
    ? Object.values(result).map((r) => r.join('\n')).join('\n\n')
    : '<No Plagiarisms Detected>';
};

const run = async () => {
  const testSolutionGroups = groupBy(allSolutions, 'homeworkid');

  const homeworkTexts = [];
  for (const [, testSolutions] of Object.entries(testSolutionGroups)) {
    const checking = createChecking(testSolutions);
    const distances = findSimilarities(checking);
    const duplicates = findDuplicates(checking);
    const matches = getMatchesForSolutionSimilarities([...distances, ...duplicates]);

    const yearCode = testSolutions[0].yearcode;
    const homeworkName = testSolutions[0].homeworkname;
    homeworkTexts.push(`${yearCode} ${homeworkName}

${matches}`);
  }
  fs.writeFile('output.txt', homeworkTexts.sort((a) => a.split('\n')[0]).join('\n\n'));
};

run();
