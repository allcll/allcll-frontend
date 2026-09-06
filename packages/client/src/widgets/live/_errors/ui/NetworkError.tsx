import NoneLayout from '@/shared/ui/NoneLayout';
import { RenewIcon, WarningFilledIcon } from '@allcll/allcll-ui';

interface NetworkErrorProps {
  onReload: () => void;
}

function NetworkError({ onReload }: Readonly<NetworkErrorProps>) {
  return (
    <NoneLayout
      title="알림 과목을 불러올 수 없습니다"
      description="네트워크 연결을 확인해주세요"
      icon={<WarningFilledIcon className="w-7 h-7 text-gray-300" />}
    >
      <button
        className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        onClick={onReload}
      >
        <RenewIcon className="w-3 h-3 text-white" />
        새로고침
      </button>
    </NoneLayout>
  );
}

export default NetworkError;
