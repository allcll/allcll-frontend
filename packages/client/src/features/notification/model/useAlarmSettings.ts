import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import VibrationNotification from '../lib/vibrationNotification.ts';

export enum AlarmType {
  NONE = 0,
  BROWSER = 1,
  TOAST = 2,
  BOTH = 3,
}

export enum SubAlarmType {
  NONE = 0,
  VIBRATE = 1,
  SOUND = 2,
  ALL = 3,
}

interface IUseAlarmSettings {
  alarmType: AlarmType;
  subAlarmType: SubAlarmType;
  isEnabled: boolean;
  saveSettings: (settings: Partial<Omit<IUseAlarmSettings, 'saveSettings'>>) => void;
}

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const getDefaultAlarmType = () => {
  const canNotify = 'Notification' in window;
  const isMobile = isMobileDevice();

  const alarmType = AlarmType.BROWSER * Number(canNotify) + AlarmType.TOAST * Number(isMobile);
  return (alarmType || AlarmType.TOAST) as AlarmType;
};

const getDefaultSubAlarmType = () => {
  const canNotify = VibrationNotification.canNotify();
  return (SubAlarmType.VIBRATE * Number(canNotify) + SubAlarmType.SOUND) as SubAlarmType;
};

const useAlarmSettings = create<IUseAlarmSettings>()(
  persist(
    set => ({
      alarmType: getDefaultAlarmType(),
      subAlarmType: getDefaultSubAlarmType(),
      isEnabled: true,
      saveSettings: settings => set(prev => ({ ...prev, ...settings })),
    }),
    {
      name: 'AlarmSettings',
      version: 1,
      partialize: state => ({
        alarmType: state.alarmType,
        subAlarmType: state.subAlarmType,
        isEnabled: state.isEnabled,
      }),
      // 알림 유형의 '알림 없음'을 없애면서, 그 설정을 쓰던 사용자는 기본 유형에 알림 꺼짐으로 옮김
      migrate: persisted => {
        const state = persisted as Pick<IUseAlarmSettings, 'alarmType' | 'subAlarmType'>;
        if (state.alarmType === AlarmType.NONE) return { ...state, alarmType: getDefaultAlarmType(), isEnabled: false };
        return { ...state, isEnabled: true };
      },
    },
  ),
);

export function isAlarmActivated(type: AlarmType) {
  const alarmTypes = useAlarmSettings.getState().alarmType;
  return Boolean(alarmTypes & type);
}

export function isSubAlarmActivated(type: SubAlarmType) {
  const subAlarmTypes = useAlarmSettings.getState().subAlarmType;
  return Boolean(subAlarmTypes & type);
}

export default useAlarmSettings;
