import NoneLayout from '@/shared/ui/NoneLayout';
import { WarningIcon } from '@allcll/allcll-ui';

function SystemChecking() {
  return (
    <NoneLayout
      title="서비스가 잠시 점검 중이에요"
      description="빠르게 문제 해결 후 더 좋은 서비스로 돌아오겠습니다!"
      icon={<WarningIcon className="w-7 h-7 text-gray-300" />}
    />
  );
}

export default SystemChecking;
