import useSWR from 'swr';
import fetchGet from '../../utils/fetchGet';
import { selectAllUsers } from '../../services/api/database/user';

/**
 *
 */

export const selectUsers = async (url) => {
  return await fetchGet(url);
};

export default () => {
  const api2 = '/api/users/allUsers';
  const api = 'localhost:3000/api/users/allUsers';
  const test = 'https://praxisprojekt.cf/';
  const data = selectUsers(test);
  // const { data, error } = useSWR(api2);
  console.log(data);
};
