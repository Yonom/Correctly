import { Pool } from 'pg';
import key from '../../.keys/key.json';

const config = {
  host: 'main-vm.praxisprojekt.cf',
  database: 'app',
  port: 26257,
  ...key.cockroach
};

const pool = new Pool(config);

/**
 * Tests the database for availability
 */
export const databaseTest = async () => {
  const client = await pool.connect();
  client.release();
};
