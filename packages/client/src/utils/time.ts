export function timeSleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDateLocale(dateKST: string, tz: number = 9) {
  const originOffset = tz * 60;

  const locale = new Date();
  const kst = new Date(dateKST);
  kst.setMonth(kst.getMonth() - originOffset - locale.getTimezoneOffset());

  return kst;
}
