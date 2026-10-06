export function formatTMNum(tm_num: string) {
  if (!tm_num) {
    return '-';
  }

  const parts = tm_num.split('/');
  parts[0] = Number.parseFloat(parts[0]).toFixed(1);

  return parts.join('/');
}

export function formatSemesterAt(semester_at: number) {
  return semester_at === -1 ? '' : semester_at;
}
