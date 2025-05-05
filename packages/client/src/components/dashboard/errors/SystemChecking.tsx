import NoneLayout from '@/components/dashboard/NoneLayout.tsx';
import ImportantSvg from '@/assets/important.svg?react';

function SystemChecking() {
  return (
    <NoneLayout
      title="서비스가 잠시 점검 중이에요"
      description="더 좋은 서비스로 돌아올게요!"
      icon={<ImportantSvg className="w-7 h-7" />}
    />
  );
}

export default SystemChecking;
