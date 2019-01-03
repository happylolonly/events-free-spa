import moment from 'moment';

export const isChristmasHolidays = () => {
  const month = moment().month();

  if ([11, 0, 1].includes(month)) {
    return true;
  }

  return false;
};
