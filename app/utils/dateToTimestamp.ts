export function dateToTimestamp(date: Date) {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object provided.");
  }

  // Extract date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Construct MySQL timestamp string
  const mysqlTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return mysqlTimestamp;
}
