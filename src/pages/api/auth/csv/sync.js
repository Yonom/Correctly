import csvParser from 'neat-csv';
import { authProvider } from '../../../../utils/config';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import { upsertUser } from '../../../../services/api/database/user';
import { loadCSVUsers } from '../../../../utils/api/loadConfig';

const csvSyncAPI = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');

  if (authProvider !== 'csv') {
    return res.status(400).json({ code: 'auth/csv-not-enabled' });
  }

  const users = await csvParser(loadCSVUsers());
  for (const user of users) {
    upsertUser(user.userId, user.email, user.firstName, user.lastName, user.studentId, true);
  }
  return res.status(200).json({ });
};

export default csvSyncAPI;
