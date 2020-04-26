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

/**
 * Runs a single query.
 *
 * @param {string} text The query to run.
 * @param {object<string, string>} params The parameters to insert into the query.
 */
export const databaseQuery = async (text, params = undefined) => {
  return await pool.query(text, params);
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
