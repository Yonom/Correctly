import { Pool } from 'pg';
import key from '../../../../.keys/key.json';

const config = {
  host: 'main-vm.praxisprojekt.cf',
  database: 'app',
  port: 26257,
  ...key.cockroach,
};

const pool = new Pool(config);

/**
 * Tests the database for availability
 */
export const databaseTest = async () => {
  const client = await pool.connect();
  client.release();
};

export const databaseReturnQuery2 = async (text, params = undefined) => {
  try {
    console.log('test1');
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.log(err.stack);
    return null;
  }
};

export const databaseReturnQuery = async (text, params = undefined) => {
  const rows = [];
  pool
    .query(text, params)
    .then((res) => {
      for (let i = 0; i < res.rows.length; i++) {
        rows.push(res.rows[i]);
      }
    })
    .catch((err) => setImmediate(() => {
      throw err;
    }));
  return rows;
};

export const printUserEntries = async () => {
  const queryText = 'SELECT * FROM users';
  const maxNumber = 20;
  const consoleString = [];
  pool
    .query(queryText)
    .then((res) => {
      for (let i = 0; i < res.rows.length && i < maxNumber; i++) {
        consoleString.push(`row: ${String(i)}: `, res.rows[i]);
        // console.log(`row: ${String(i)}: `, res.rows[i]);
      }
    })
    .catch((err) => setImmediate(() => {
      throw err;
    }));
  return consoleString;
};

/**
 * Runs a single query.
 *
 * @param {string} text The query to run.
 * @param {object<string, string>} params The parameters to insert into the query.
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export const databaseQuery = (text, params = undefined) => {
  return pool.query(text, params);
};

/**
 * Starts a transaction and calls the callback function.
 * If the callback executes without exceptions, the transaction is commited, otherwise rolled back.
 *
 * @param {Function<import('pg').PoolClient> | Function<Promise<import('pg').PoolClient>>} callback The callback to be called.
 */
export const databaseTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await callback(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
