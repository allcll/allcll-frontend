export const formatTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${year}-${month}-${day}  ${String(hour).padStart(2, '0')}:${minute}`;
};
