import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import VibrationNotification from '@/utils/notification/vibrationNotification.ts';

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
  saveSettings: (settings: Partial<Exclude<IUseAlarmSettings, 'saveSettings' | 'resetSettings'>>) => void;
  resetSettings: () => void;
}

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const getDefaultAlarmType = () => {
  const canNotify = 'Notification' in window;
  const isMobile = isMobileDevice();

  return (AlarmType.BROWSER * Number(canNotify) + AlarmType.TOAST * Number(isMobile)) as AlarmType;
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
      saveSettings: settings => set(prev => ({ ...prev, ...settings })),
      resetSettings: () =>
        set(() => ({
          alarmType: getDefaultAlarmType(),
          subAlarmType: getDefaultSubAlarmType(),
        })),
    }),
    {
      name: 'AlarmSettings',
      partialize: state => ({ alarmType: state.alarmType, subAlarmType: state.subAlarmType }),
      // merge: (persistedState, currentState) => ({ ...currentState, ...persistedState }),
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
