import CloseSvg from '@/assets/x-gray.svg?react';
import { useEffect } from 'react';
import useAlarmSettings from '@/store/useAlarmSettings.ts';

interface IAlarmOptionModal {
  isOpen: boolean;
  close: () => void;
}

function AlarmOptionModal({ isOpen, close }: IAlarmOptionModal) {
  const isAlarmActivated = useAlarmSettings(state => state.isAlarmActivated);
  const isToastActivated = useAlarmSettings(state => state.isToastActivated);
  const saveSettings = useAlarmSettings(state => state.saveSettings);

  function closeAndSave() {
    saveSettings({ isAlarmActivated, isToastActivated });
    close();
  }

  // 뒤로가기 버튼 인식 후, 알림 설정 저장 후 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAndSave();
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      closeAndSave();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return !isOpen ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-contrast-50" onClick={closeAndSave}>
      <div className="bg-white p-4 rounded-lg w-96 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">알림 설정</h2>
          <button aria-label="close" onClick={closeAndSave} className="rounded-full p-2 hover:bg-blue-100">
            <CloseSvg />
          </button>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAlarmActivated}
              onChange={e => saveSettings({ isAlarmActivated: e.target.checked })}
            />
            <span className="flex items-center space-x-2">
              <span>브라우저 알림</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isToastActivated}
              onChange={e => saveSettings({ isToastActivated: e.target.checked })}
            />
            <span className="flex items-center space-x-2">
              <span>토스트 알림</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default AlarmOptionModal;
