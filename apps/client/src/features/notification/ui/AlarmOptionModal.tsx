import React from 'react';
import useBackSignal from '@/shared/lib/useBackSignal.ts';
import BrowserNotification from '../lib/browserNotification';
import useNotificationInstruction from '../model/useNotificationInstruction';
import ToastNotification from '../lib/toastNotification';
import { AlarmNotification } from '../lib/useNotification';
import VibrationNotification from '../lib/vibrationNotification';
import useAlarmSettings, { AlarmType, isSubAlarmActivated, SubAlarmType } from '../model/useAlarmSettings';
import { Dialog, Button, Select, Toggle, Heading } from '@allcll/allcll-ui';

interface IAlarmOptionModal {
  isOpen: boolean;
  close: () => void;
}

const AlarmTypeNames = [
  { title: '브라우저 알림', value: AlarmType.BROWSER, disabled: () => !BrowserNotification.canNotify() },
  { title: '토스트 알림', value: AlarmType.TOAST, disabled: () => !ToastNotification.canNotify() },
  {
    title: '브라우저 + 토스트 알림',
    value: AlarmType.BOTH,
    disabled: () => !BrowserNotification.canNotify() || !ToastNotification.canNotify(),
  },
];

function AlarmOptionModal({ isOpen, close }: IAlarmOptionModal) {
  const hasPermission = useNotificationInstruction(state => state.isPermitted);
  const usesToast = useAlarmSettings(state => Boolean(state.alarmType & AlarmType.TOAST));

  const onTestAlarm = () => {
    AlarmNotification.show('알림 기능을 테스트합니다', 'test-alarm');
  };

  const onClose = () => {
    AlarmNotification.requestPermission();
    close();
  };

  // 뒤로가기 버튼 인식 후, 알림 설정 저장 후 모달 닫기
  useBackSignal({ enabled: isOpen, onClose: onClose });

  return !isOpen ? null : (
    <Dialog title="알림 설정" onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <AlarmOptionContent />
        <SubAlarmOption />
      </Dialog.Content>

      <Dialog.Footer>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          onClick={onTestAlarm}
          disabled={!hasPermission && !usesToast}
        >
          알림 테스트
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

function AlarmOptionContent() {
  const alarmType = useAlarmSettings(state => state.alarmType);
  const saveSettings = useAlarmSettings(state => state.saveSettings);
  const hasPermission = useNotificationInstruction(state => state.isPermitted);
  const canBrowserNotify = BrowserNotification.canNotify();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveSettings({ alarmType: Number(e.target.value) as AlarmType });
  };

  return (
    <div className="mb-4">
      <Heading level={4} id="alarm-type-heading" className="mb-2">
        알림 유형
      </Heading>
      <div className="flex flex-col gap-1.5">
        <Select
          id="alarm-type-select"
          aria-labelledby="alarm-type-heading"
          className="w-full"
          value={alarmType}
          onChange={onChange}
        >
          {AlarmTypeNames.map(type => (
            <option className="disabled:text-gray-500" key={type.value} value={type.value} disabled={type.disabled()}>
              {type.title}
            </option>
          ))}
        </Select>

        {(alarmType === AlarmType.BROWSER || alarmType === AlarmType.BOTH) && !hasPermission && (
          <p className="text-xs text-danger-500">브라우저 알림을 허용해주세요.</p>
        )}
        {alarmType === AlarmType.TOAST && (
          <p className="text-xs text-gray-500">토스트 알림은 탭이 열려 있을 때에만 작동해요.</p>
        )}
        {!canBrowserNotify && <p className="text-xs text-gray-500">이 브라우저는 브라우저 알림을 지원하지 않아요.</p>}
      </div>
    </div>
  );
}

function SubAlarmOption() {
  const isSound = isSubAlarmActivated(SubAlarmType.SOUND);
  const isVibrate = isSubAlarmActivated(SubAlarmType.VIBRATE);
  const canVibrate = VibrationNotification.canNotify();

  const subAlarmType = useAlarmSettings(state => state.subAlarmType);
  const saveSettings = useAlarmSettings(state => state.saveSettings);

  const isVibrateDisabled = !canVibrate;

  const toggleSubAlarm = (target: SubAlarmType, checked: boolean) => {
    // checked이면 비트 연산자로 플래그 추가, 아니면 제거
    const newType = checked ? subAlarmType | target : subAlarmType & ~target;

    saveSettings({ subAlarmType: newType as SubAlarmType });
  };

  return (
    <div>
      <Heading level={4} className="mb-2">
        추가 알림 옵션
      </Heading>
      <div className="flex flex-col gap-2">
        <div className="my-1 flex items-center justify-between">
          <label htmlFor="select-sound" className="text-sm">
            소리
          </label>
          <Toggle
            id="select-sound"
            name="sound"
            checked={isSound}
            onCheckedChange={checked => toggleSubAlarm(SubAlarmType.SOUND, checked)}
          />
        </div>

        <div className="my-1 flex items-center justify-between">
          <label htmlFor="select-vibrate" className={`text-sm ${isVibrateDisabled ? 'text-gray-300' : ''}`}>
            진동
          </label>
          <Toggle
            id="select-vibrate"
            name="vibrate"
            checked={isVibrate}
            onCheckedChange={checked => toggleSubAlarm(SubAlarmType.VIBRATE, checked)}
            disabled={isVibrateDisabled}
          />
        </div>
        {!canVibrate && <p className="text-xs text-gray-500">이 기기는 진동 기능을 지원하지 않아요.</p>}
      </div>
    </div>
  );
}

export default AlarmOptionModal;
