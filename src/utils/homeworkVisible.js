import moment from 'moment';

export const homeworkVisible = (startTime) => {
  return moment().diff(startTime) >= 0;
};
