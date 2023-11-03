export const formatDate = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const convertDateStringToDate = (dateString: string): Date => {
  const parts = dateString.match(/(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/);
  if (!parts) {
    throw new Error('Invalid date string format');
  }

  const [, hours, minutes, day, month, year] = parts;
  const jsDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
  return jsDate;
};
