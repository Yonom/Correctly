import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectSolutionsAndReviewsForHomeworkExport } from '../../../services/api/database/solutions';
import { isSuperuser } from '../../../utils/auth/role';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import withSentry from '../../../utils/api/withSentry';
import { selectEditableHomeworksForUser, selectHomeworkUsersWithoutSolution } from '../../../services/api/database/homework';

const getHomeworkCSVAPI = async (req, res, { userId, role }) => {
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-course-id' });
  }

  let isAllowed = false;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
    // checks if given userid is allowed to change the given homework
    const editableCourses = await selectEditableHomeworksForUser(userId, false);
    for (let i = 0; i < editableCourses.rows.length; i++) {
      if (homeworkId === editableCourses.rows[i].id) { isAllowed = true; }
    }
  }

  if (!isAllowed) {
    // throws status(404) if user is not allowed to change the homework
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homeworkQuery = await selectSolutionsAndReviewsForHomeworkExport(homeworkId);
  const homeworkNoSolutionQuery = await selectHomeworkUsersWithoutSolution(homeworkId);

  const allRows = homeworkQuery.rows.concat(homeworkNoSolutionQuery.rows);

  return res.json(allRows.map((homework) => ({
    id: homework.id,
    userid: homework.userid,
    homeworkname: homework.homeworkname,
    title: homework.title,
    yearcode: homework.yearcode,
    name: `${homework.firstname} ${homework.lastname}`,
    maxreachablepoints: homework.maxreachablepoints,
    percentagegrade: homework.percentagegrade,
    actualpointsearned: homework.actualpointsearned,
    reviewers: homework.reviewers,
    reviewcomments: homework.reviewcomments,
    reviewgrades: homework.reviewgrades,
  })));
};

export default withSentry(authMiddleware(getHomeworkCSVAPI));
