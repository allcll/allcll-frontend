import NoneLayout from '@/components/dashboard/NoneLayout.tsx';
import ImportantSVG from '@/assets/important.svg?react';
import ReloadSvg from '@/assets/reload-white.svg?react';

interface NetworkErrorProps {
  onReload: () => void;
}

function NetworkError({ onReload }: NetworkErrorProps) {
  return (
    <NoneLayout
      title="핀 고정된 과목을 불러올 수 없습니다"
      description="네트워크 연결을 확인해주세요"
      icon={<ImportantSVG className="w-7 h-7" />}
    >
      <button
        className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        onClick={onReload}
      >
        <ReloadSvg className="w-3 h-3" />
        새로고침
      </button>
    </NoneLayout>
  );
}

export default NetworkError;
