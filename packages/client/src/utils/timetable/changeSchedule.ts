// Fixme: 파일 삭제 해주세요
const EventName = 'schedule-mutation';

export enum ScheduleMutationType {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  CANCEL = 'cancel',
}

interface IMutationScheduleEvent {
  type: ScheduleMutationType;
}

declare global {
  interface CustomEventMap {
    [EventName]: CustomEvent<IMutationScheduleEvent>;
  }
  interface WindowEventMap extends CustomEventMap {}
}

export function changeSchedule(type: ScheduleMutationType) {
  window.dispatchEvent(
    new CustomEvent(EventName, {
      detail: { type },
    }),
  );
}

/** Schedule 추가 / 수정 / 삭제 기능 실행 시, API 요청 전까지 기능 */
/** @deprecated*/
export function MutationSchedule() {
  return new Promise((resolve, reject) => {
    console.log('MutationSchedule event received:', EventName);

    const action = (event: CustomEvent<IMutationScheduleEvent>) => {
      console.log('MutationSchedule event received:', EventName);

      switch (event.detail.type) {
        case ScheduleMutationType.CREATE:
          resolve(event.detail);
          break;
        case ScheduleMutationType.EDIT:
          resolve(event.detail);
          break;
        case ScheduleMutationType.DELETE:
          resolve(event.detail);
          break;
        case ScheduleMutationType.CANCEL:
          resolve(Promise.resolve());
          break;
        default:
          reject(new Error('Unknown schedule mutation type'));
      }

      window.removeEventListener(EventName, action);
    };

    window.addEventListener(EventName, action);
  });
}
