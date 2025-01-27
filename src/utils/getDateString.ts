import getDateTimeString, { GetDateTimeStringOptions } from './getDateTimeString';

function getDateString(
  date: Date | string | null | undefined,
  options: GetDateTimeStringOptions = {}
) {
  return getDateTimeString(date, { hideTime: true, ...options });
}

export default getDateString;
