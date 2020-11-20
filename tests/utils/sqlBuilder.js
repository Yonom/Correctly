/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { strict as assert } from 'assert';
import { isMoment } from 'moment';
import { databaseQuery } from '../../src/services/api/database';

const databaseQueryEx = async (text, params) => {
  const serializedParams = params.map((p) => {
    return isMoment(p) ? p.toDate() : p;
  });
  return databaseQuery(text, serializedParams);
};

const update = async (table, idColumnName, id, obj) => {
  const fields = Object.keys(obj);
  const values = Object.values(obj);
  const sql = `UPDATE ${table} SET ${fields.map((name, i) => `${name} = $${i + 2}`).join()} WHERE ${idColumnName} = $1 RETURNING *`;
  const result = await databaseQueryEx(sql, [id, ...values]);
  assert(result.rowCount > 0);
  return result.rows[0];
};

const addFunctions = (table, fields, resultObj) => {
  const idColumnName = fields[0].name;
  resultObj.refresh = async function refresh() {
    const idValue = resultObj[idColumnName];
    const updateResult = await selectFrom(table, idColumnName, idValue);
    const updateResultObj = updateResult[0];
    Object.assign(this, updateResultObj);
  };
  resultObj.set = async function set(setObj) {
    const setResult = await update(table, idColumnName, resultObj[idColumnName], setObj);
    Object.assign(this, setResult);
  };
};

export const selectFrom = async (table, columnName, value) => {
  const sql = `SELECT * FROM ${table} WHERE ${columnName} = $1`;
  const result = await databaseQueryEx(sql, [value]);
  result.rows.forEach((r) => addFunctions(table, result.fields, r));
  return result.rows;
};

export const insertInto = async (table, ...values) => {
  const hasUniqueRowId = table !== 'users';
  const sql = `INSERT INTO ${table} VALUES (${hasUniqueRowId ? 'unique_rowid(),' : ''}${values.map((_, i) => `$${i + 1}`).join()}) RETURNING *`;
  const result = await databaseQueryEx(sql, values);
  const resultObj = result.rows[0];
  addFunctions(table, result.fields, resultObj);
  return resultObj;
};

export const deleteFrom = async (table, columnName, id) => {
  const sql = `DELETE FROM ${table} WHERE ${columnName} = $1`;
  const result = await databaseQueryEx(sql, [id]);
  assert(result.rowCount > 0);
};
