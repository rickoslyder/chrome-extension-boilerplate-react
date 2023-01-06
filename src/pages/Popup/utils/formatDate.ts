import { DateTime } from 'luxon';
import isDateString from './isDateString';

const formatDate = (dateString: any) => {
  if (isDateString(dateString as string)) {
    console.log('validated dateString = ', dateString);
    let date = DateTime.fromJSDate(new Date(dateString as string));
    console.log('date to be formatted - ', date);
    let formattedDate = date.toLocaleString(DateTime.DATE_HUGE);
    console.log('formatted date - ', formattedDate);
    return formattedDate;
  } else {
    return dateString;
  }
};

export default formatDate;
