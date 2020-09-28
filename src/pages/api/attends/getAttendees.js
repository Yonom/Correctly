import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAttendees, selectAttendeesForUser } from '../../../services/api/database/attends';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const getAttendees = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // get parameters
  const { courseId } = req.query;

  if (courseId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'attends/no-course-id' });
  }

  let attendsQuery;
  if (isSuperuser(role)) {
    attendsQuery = await selectAttendees(courseId);
  } else {
    attendsQuery = await selectAttendeesForUser(courseId, userId);
  }

  const attendees = attendsQuery.rows;
  // empty json to confirm success
  return res.json(attendees);
};

export default authMiddleware(getAttendees);
