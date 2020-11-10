import moment from 'moment';
import { isStudent } from './auth/role';

export const homeworkVisible = (startTime, role) => {
  if (isStudent(role)) {
    return moment().diff(startTime) >= 0;
  }
  return true;
};
