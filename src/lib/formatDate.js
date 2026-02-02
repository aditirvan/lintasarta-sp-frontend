import moment from 'moment'
export const FormatDate = (date) => {
    const d = new Date(date)
    return `${moment(d).format('DD')}/${moment(d).format('MM')}/${moment(d).format('YYYY')}`
}

export const FormatDateTime = (dateString) => {
// Parse the date string to a Date object
  const date = new Date(dateString);

  // Extract the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date components into the desired format
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}