import TokenSetting from '@/components/clawlers/TokenSetting';
import ToastNotification from '@allcll/common/components/toast/ToastNotification';

function SessionSetting() {
  return (
    <div className="p-6 space-y-10">
      <ToastNotification />
      <h1 className="text-lg text-gray-700 font-bold mb-4">크롤러 설정</h1>

      <div className="flex flex-col gap-4">
        <TokenSetting />
      </div>
    </div>
  );
}

export default SessionSetting;
