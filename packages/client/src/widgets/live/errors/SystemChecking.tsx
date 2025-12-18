import NoneLayout from '@/widgets/live/errors/NoneLayout';
import ImportantSvg from '@/assets/important.svg?react';

function SystemChecking() {
  return (
    <NoneLayout
      title="서비스가 잠시 점검 중이에요"
      description="빠르게 문제 해결 후 더 좋은 서비스로 돌아오겠습니다!"
      icon={<ImportantSvg className="w-7 h-7" />}
    />
  );
}

export default SystemChecking;
