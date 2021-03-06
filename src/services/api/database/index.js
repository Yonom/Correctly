import { Pool } from 'pg';
import { loadKey } from '../../../utils/api/loadConfig';

const { cockroach: cockroachKeyConfig } = loadKey();

const config = {
  database: 'app',
  port: 26257,
  ...cockroachKeyConfig,
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
export const databaseQuery = (text, params = undefined) => {
  return pool.query(text, params);
};

/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/no-undefined-types */
/**
 * Starts a transaction and calls the callback function.
 * If the callback executes without exceptions, the transaction is commited, otherwise rolled back.
 *
 * @param {function(import('pg').PoolClient):Promise<T>} callback The callback to be called.
 * @returns {T} The result of callback
 * @template T
 */
export const databaseTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    for (let i; ; i++) {
      await client.query('BEGIN');
      try {
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (e) {
        try {
          await client.query('ROLLBACK');
        } catch {
          // do nothing
        }

        if (e.code === '40001') {
          // contention error, retry soon
          await new Promise((resolve) => setTimeout(resolve, 100 * (2 ** i)));
        } else {
          throw e;
        }
      }
    }
  } finally {
    client.release();
  }
};

export const databaseEnd = async () => {
  return pool.end();
};
