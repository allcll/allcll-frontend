export const formatTime = (dateString: string | null) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const yyyy = kst.getFullYear();
  const mm = String(kst.getMonth() + 1).padStart(2, '0');
  const dd = String(kst.getDate()).padStart(2, '0');

  const hour = String(kst.getHours()).padStart(2, '0');
  const minute = String(kst.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hour}:${minute}`;
};
