import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworkUnfinished } from '../../../services/api/database/homework';

const doSomething = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { rcdf } = req.query;

  if (rcdf == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'Jonas ist doof' });
  }

  const homeworkQuery = await selectHomeworkUnfinished(rcdf);
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'Carl ist doof' });
  }

  const homework = homeworkQuery.rows[0];

  // empty json to confirm success
  return res.json({
    homeworkname: homework.homeworkname,
    doingstart: homework.doingstart,
    doingend: homework.doingend,
  });
};

export default doSomething;
