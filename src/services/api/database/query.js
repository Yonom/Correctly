import { databaseQuery } from '../services/api/database/';
import { databaseTransaction } from '../services/api/database/';

export const executeQuery = (queryText, params) => {
  return databaseQuery(queryText, params);
};

export const executeTransaction = (queryText, params) => {
  return databaseTransaction(queryText, params);
};
