export function formatDateForConfirmation(dateString) {

  const month = parseInt(dateString.slice(0, 2), 10);
  const day = parseInt(dateString.slice(2, 4), 10);
  const year = parseInt(dateString.slice(4, 8), 10);

  // Create a new Date object
  const date = new Date(year, month - 1, day);

  // Define arrays for days and months
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Get the formatted parts of the date
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dateNum = date.getDate();
  const yearNum = date.getFullYear();

  // Return the formatted date string
  return `${dayName} ${monthName} ${dateNum}, ${yearNum}`;
}

export function formatDate(startDate) {
  const formattedDate = startDate.split("-");

  console.log("formattedDate", formattedDate)

  let [year, month, day] = formattedDate;
  if (month.length === 1 ) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  const dateWithNoHyphens = month + day + year;
  return dateWithNoHyphens;
}

export function formatDateToUS(startDate) {
  console.log("startDate", startDate)
  const formattedDate = startDate.split("-");

  let [year, month, day] = formattedDate;
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  return `${month}/${day}/${year}`;
}

