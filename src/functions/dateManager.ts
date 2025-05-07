export const DateToString = (date: Date) => {
  return date.toLocaleDateString('en-GB').replace(/\//g, '.');
};

export function stringToDate(isoString: string): Date {
  return new Date(isoString);
}

export function formatDateToISO(date: Date, hours: number = 0, minutes: number = 0, seconds: number = 0): string {
  const newDate = new Date(date); // Копія дати
  newDate.setHours(hours, minutes, seconds);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Місяці починаються з 0
  const day = String(newDate.getDate()).padStart(2, '0');
  const hour = String(newDate.getHours()).padStart(2, '0');
  const minute = String(newDate.getMinutes()).padStart(2, '0');
  const second = String(newDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}