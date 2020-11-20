/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { databaseQuery } from '../../src/services/api/database';

export const insertInto = async (table, ...values) => {
  const hasUniqueRowId = table !== 'users';
  const sql = `INSERT INTO ${table} VALUES (${hasUniqueRowId ? 'unique_rowid(),' : ''}${values.map((_, i) => `$${i + 1}`).join()}) RETURNING *`;
  const result = await databaseQuery(sql, values);
  const resultObj = result.rows[0];
  const idColumnName = result.fields[0].name;
  addRefreshFunction(table, idColumnName, resultObj);
  return resultObj;
};
