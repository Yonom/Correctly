import { databaseTest } from '../../services/api/database';

const health = async (req, res) => {
  // test database
  try {
    await databaseTest();
  } catch (ex) {
    res.status(500).json({ db: false });

    throw ex;
  }

  // everything OK
  res.json({});
};

export default health;
