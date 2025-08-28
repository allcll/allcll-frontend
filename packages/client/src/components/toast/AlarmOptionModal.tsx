import React from 'react';
import Button from '@common/components/Button.tsx';
import Toggle from '@common/components/Toggle.tsx';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import useBackSignal from '@/hooks/useBackSignal.ts';
import { AlarmNotification } from '@/hooks/useNotification.ts';
import useAlarmSettings, { AlarmType, isSubAlarmActivated, SubAlarmType } from '@/store/useAlarmSettings.ts';
import UseNotificationInstruction from '@/store/useNotificationInstruction.ts';

interface IAlarmOptionModal {
  isOpen: boolean;
  close: () => void;
}

const AlarmTypeNames = [
  { title: '알림 없음', value: AlarmType.NONE },
  { title: '브라우저 알림', value: AlarmType.BROWSER },
  { title: '토스트 알림', value: AlarmType.TOAST },
  { title: '브라우저 + 토스트 알림', value: AlarmType.BOTH },
];

function AlarmOptionModal({ isOpen, close }: IAlarmOptionModal) {
  const onClose = () => {
    AlarmNotification.requestPermission();
    close();
  };
  // 뒤로가기 버튼 인식 후, 알림 설정 저장 후 모달 닫기
  useBackSignal({ enabled: isOpen, onClose: onClose });

  return !isOpen ? null : (
    <Modal onClose={onClose}>
      <ModalHeader title="알림설정" onClose={onClose} />
      <div className="p-4 w-md max-w-full">
        <AlarmOptionContent />
        <SubAlarmOption />
      </div>
    </Modal>
  );
}

function AlarmOptionContent() {
  const alarmType = useAlarmSettings(state => state.alarmType);
  const saveSettings = useAlarmSettings(state => state.saveSettings);
  const hasPermission = UseNotificationInstruction(state => state.isPermitted);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveSettings({ alarmType: Number(e.target.value) as AlarmType });
  };

  const onTestAlarm = () => {
    AlarmNotification.show('알림 기능을 테스트합니다', 'test-alarm');
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold text-md" htmlFor="alarm-type-select">
        알림 유형
      </label>
      <select
        id="alarm-type-select"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        value={alarmType}
        onChange={onChange}
      >
        {AlarmTypeNames.map(type => (
          <option key={type.value} value={type.value}>
            {type.title}
          </option>
        ))}
      </select>

      {(alarmType === AlarmType.BROWSER || alarmType === AlarmType.BOTH) && !hasPermission && (
        <p className="pl-2 pb-2 text-sm text-red-600">브라우저 알림을 허용해주세요.</p>
      )}
      {alarmType === AlarmType.TOAST && (
        <p className="pl-2 pb-2 text-sm text-red-600">토스트 알림은 탭이 열려 있을 때에만 작동해요.</p>
      )}

      <div className="flex justify-end">
        <Button variants="secondary" onClick={onTestAlarm} disabled={!hasPermission}>
          알림테스트
        </Button>
      </div>
    </div>
  );
}

function SubAlarmOption() {
  const subAlarmType = useAlarmSettings(state => state.subAlarmType);
  const saveSettings = useAlarmSettings(state => state.saveSettings);

  const isSoundEnabled = isSubAlarmActivated(SubAlarmType.SOUND);
  const isVibrateEnabled = isSubAlarmActivated(SubAlarmType.VIBRATE);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // checked이면 비트 연산자로 플래그 추가, 아니면 제거
    const target = e.target.id === 'select-sound' ? SubAlarmType.SOUND : SubAlarmType.VIBRATE;
    const newType = e.target.checked ? subAlarmType | target : subAlarmType & ~target;

    saveSettings({ subAlarmType: newType as SubAlarmType });
  };

  return (
    <div>
      <h3 className="block mb-2 font-bold text-md">추가 알림 옵션</h3>
      <div className="flex flex-col gap-2">
        <label className="my-1 flex items-center justify-between" htmlFor="select-sound">
          <span className="text-gray-300">소리</span>
          <Toggle id="select-sound" name="sound" checked={isSoundEnabled} onChange={onChange} disabled />
        </label>

        <label className="my-1 flex items-center justify-between" htmlFor="select-vibrate">
          <span>진동</span>
          <Toggle id="select-vibrate" name="vibrate" checked={isVibrateEnabled} onChange={onChange} />
        </label>
      </div>
    </div>
  );
}

export default AlarmOptionModal;
