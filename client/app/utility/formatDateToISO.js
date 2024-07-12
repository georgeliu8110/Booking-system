export default function formatDateToISO(dateString, time = '10:00:00', timeZone = '-05:00') {
  // Extract month, day, and year from the input string
  const month = dateString.slice(0, 2);
  const day = dateString.slice(2, 4);
  const year = dateString.slice(4);

  // Create a date object
  const date = new Date(`${year}-${month}-${day}T${time}${timeZone}`);

  // Return the date in ISO 8601 format
  return date.toISOString();
}
