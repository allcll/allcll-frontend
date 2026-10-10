import NoneLayout from '@/shared/ui/NoneLayout';
import { Button, RenewIcon, WarningIcon } from '@allcll/allcll-ui';

interface NetworkErrorProps {
  onReload: () => void;
}

function NetworkError({ onReload }: Readonly<NetworkErrorProps>) {
  return (
    <NoneLayout title="알림 과목을 불러올 수 없습니다" description="네트워크 연결을 확인해주세요" icon={WarningIcon}>
      <Button variant="solid" size="small" onClick={onReload}>
        <RenewIcon className="w-3 h-3" />
        새로고침
      </Button>
    </NoneLayout>
  );
}

export default NetworkError;
