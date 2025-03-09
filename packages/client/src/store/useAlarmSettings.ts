import {create} from 'zustand';

interface IUseAlarmSettings {
  isAlarmActivated: boolean;
  isToastActivated: boolean;
  saveSettings: (settings: { isAlarmActivated?: boolean; isToastActivated?: boolean }) => void;
  getSettings: () => { isAlarmActivated: boolean; isToastActivated: boolean };
}

const useAlarmSettings = create<IUseAlarmSettings>((set) => ({
  isAlarmActivated: false,
  isToastActivated: true,
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

    return { isAlarmActivated: true, isToastActivated: false };
  },
}));

export default useAlarmSettings;