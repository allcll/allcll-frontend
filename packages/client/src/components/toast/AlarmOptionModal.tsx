import React from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import useBackSignal from '@/hooks/useBackSignal.ts';
import { AlarmNotification } from '@/hooks/useNotification.ts';
import useAlarmSettings, { AlarmType } from '@/store/useAlarmSettings.ts';

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
  const alarmType = useAlarmSettings(state => state.alarmType);
  const saveSettings = useAlarmSettings(state => state.saveSettings);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveSettings({ alarmType: Number(e.target.value) as AlarmType });
  };

  const onClose = () => {
    AlarmNotification.requestPermission();
    close();
  };

  // 뒤로가기 버튼 인식 후, 알림 설정 저장 후 모달 닫기
  useBackSignal({ enabled: isOpen, onClose: onClose });

  return !isOpen ? null : (
    <Modal onClose={onClose}>
      <ModalHeader title="알림설정" onClose={onClose} />
      <div className="p-4">
        <label className="block mb-2 font-bold text-lg" htmlFor="alarm-type-select">
          알림 유형
        </label>
        <select
          id="alarm-type-select"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={alarmType}
          onChange={onChange}
        >
          {AlarmTypeNames.map(type => (
            <option key={type.value} value={type.value}>
              {type.title}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}

export default AlarmOptionModal;
