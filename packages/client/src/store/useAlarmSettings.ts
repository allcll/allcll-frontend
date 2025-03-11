import {create} from 'zustand';

interface IUseAlarmSettings {
  isAlarmActivated: boolean;
  isToastActivated: boolean;
  saveSettings: (settings: { isAlarmActivated?: boolean; isToastActivated?: boolean }) => void;
  getSettings: () => { isAlarmActivated: boolean; isToastActivated: boolean };
}

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const useAlarmSettings = create<IUseAlarmSettings>((set) => ({
  isAlarmActivated: true,
  isToastActivated: false,
  saveSettings: (settings) => {
    set(({ ...prev }) => {
      const newSettings = {...prev, settings};
      localStorage.setItem('AlarmSettings', JSON.stringify(newSettings));

      return settings;
    });
  },
  getSettings: () => {
    const settings = localStorage.getItem('AlarmSettings');
    if (settings) {
      const settingJson = JSON.parse(settings);
      set(settingJson);

      return settingJson;
    }

    const initSettings = {
      isAlarmActivated: true,
      isToastActivated: isMobileDevice(),
    }
    set(initSettings);

    return initSettings;
  },
}));

export default useAlarmSettings;