import NoneLayout from '@/shared/ui/NoneLayout';
import { ListIcon } from '@allcll/allcll-ui';

function ZeroListError() {
  return (
    <NoneLayout
      title="현재 여석이 있는 TOP 10 과목이 없습니다"
      description="잠시 후 다시 확인해주세요"
      icon={<ListIcon className="w-7 h-7 text-gray-400" />}
    />
  );
}

export default ZeroListError;
