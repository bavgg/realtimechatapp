import moment from 'moment';

export function timeNow(username, message) {
  const now = moment().format('h:mm a');

  return now;
}