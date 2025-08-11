import NoneLayout from '@/components/live/NoneLayout.tsx';
import ListSVG from '@/assets/list.svg?react';

function ZeroListError() {
  return (
    <NoneLayout
      title="잠시후 수강여석 서비스가 오픈됩니다."
      description="잠시만 기다려주세요."
      icon={<ListSVG className="w-7 h-7" />}
    />
  );
}

export default ZeroListError;
