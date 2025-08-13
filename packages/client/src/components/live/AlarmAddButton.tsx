import useAlarmSearchStore from '@/store/useAlarmSearchStore.ts';

function AlarmAddButton() {
  const setIsSearchOpen = useAlarmSearchStore(state => state.setIsSearchOpen);

  return (
    <div className="p-2 rounded-full flex items-center justify-center">
      <button
        className="bg-gray-50 rounded-full px-4 py-2 text-sm border border-gray-200 hover:shadow-md cursor-pointer"
        aria-label="여석 알림 과목 추가"
        title="여석 알림 과목 추가"
        onClick={() => setIsSearchOpen(true)}
      >
        + 알림 과목 등록
      </button>
    </div>
  );
}

export default AlarmAddButton;
