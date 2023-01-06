function isDateString(dateString: string) {
  console.log("validating datestring - ", dateString);
  if (dateString == null) {
    return false;
  }
  // Try to parse the date string
  const date = new Date(dateString);
  // If the date is invalid, date.toString() will return "Invalid Date"
  return date.toString() !== "Invalid Date";
}

export default isDateString;
