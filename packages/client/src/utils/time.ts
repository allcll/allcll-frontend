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

export interface TimeObject {
  hours: number;
  minutes: number;
}

/** 00:00 ~ 23:59 형태의 시간을 관리하는 class
 * hh:mm 타입 문자열, 0~1439 숫자 타입, 객체타입 */
export class Time {
  time: number;

  constructor(time: string | number | TimeObject) {
    switch (typeof time) {
      case 'string':
        const [h, m] = time.split(':').map(Number);
        this.time = h * 60 + m;
        break;

      case 'object':
        const { hours, minutes } = time;
        this.time = hours * 60 + minutes;
        break;

      case 'number':
        this.time = time;
        break;
    }

    const MAX_TIME = 24 * 60;
    if (isNaN(this.time) || this.time < 0 || this.time >= MAX_TIME) {
      this.time = 0;
      throw new Error('Invalid time value');
    }
  }

  toObject(): TimeObject {
    const hours = Math.floor(this.time / 60);
    const minutes = this.time % 60;
    return { hours, minutes };
  }

  toString(): string {
    const { hours, minutes } = this.toObject();

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  /** referenceTime < compareTime 이면 음수
   * referenceTime > compareTime 이면 양수
   * 같으면 0 반환*/
  compare(compareTime: Time): number {
    const comp = this.time - compareTime.time;
    return comp === 0 ? 0 : comp > 0 ? 1 : -1;
  }
}
