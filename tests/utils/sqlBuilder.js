/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { databaseQuery } from '../../src/services/api/database';

const addRefreshFunction = (table, idColumnName, resultObj) => {
  resultObj.refresh = async function refresh() {
    const idValue = resultObj[idColumnName];
    const updateResult = await selectFrom(table, idColumnName, [idValue]);
    const updateResultObj = updateResult[0];
    Object.assign(this, updateResultObj);
  };
};

export const selectFrom = async (table, columnName, value) => {
  const sql = `SELECT * FROM ${table} WHERE ${columnName} = $1`;
  const result = await databaseQuery(sql, value);
  const idColumnName = result.fields[0].name;
  result.rows.forEach((r) => addRefreshFunction(table, idColumnName, r));
  return result.rows;
};

export const insertInto = async (table, ...values) => {
  const hasUniqueRowId = table !== 'users';
  const sql = `INSERT INTO ${table} VALUES (${hasUniqueRowId ? 'unique_rowid(),' : ''}${values.map((_, i) => `$${i + 1}`).join()}) RETURNING *`;
  const result = await databaseQuery(sql, values);
  const resultObj = result.rows[0];
  const idColumnName = result.fields[0].name;
  addRefreshFunction(table, idColumnName, resultObj);
  return resultObj;
};

export const deleteFrom = async (table, columnName, id) => {
  const sql = `DELETE FROM ${table} WHERE ${columnName} = $1`;
  const result = await databaseQuery(sql, [id]);
  return result.rowCount > 0;
};
