import NoneLayout from '@/components/live/NoneLayout.tsx';
import ListSVG from '@/assets/list.svg?react';

function ZeroListError() {
  return (
    <NoneLayout
      title="현재 여석이 있는 TOP 10 과목이 없습니다"
      description="잠시 후 다시 확인해주세요"
      icon={<ListSVG className="w-7 h-7" />}
    />
  );
}

export default ZeroListError;
