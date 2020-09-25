import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAttendees } from '../../../services/api/database/attends';

const getAttendees = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { courseId } = req.query;

  if (courseId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'attends/no-course-id' });
  }

  const attendsQuery = await selectAttendees(courseId);
  if (attendsQuery.rows.length === 0) {
    return res.status(404).json({ code: 'attends/not-found' });
  }
  const attendees = attendsQuery.rows;
  // empty json to confirm success
  return res.json(attendees);
};

export default getAttendees;
