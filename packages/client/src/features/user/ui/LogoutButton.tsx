import { Button } from '@allcll/allcll-ui';
import { useLogout } from '@/entities/user/model/useAuth';
import useToastNotification from '@/features/notification/model/useToastNotification';

interface LogoutButtonProps {
  onSuccess?: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

function LogoutButton({ onSuccess, variant = 'secondary', size = 'medium' }: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout();
  const showToast = useToastNotification.getState().addToast;

  const handleLogout = () => {
    if (!window.confirm('로그아웃하시겠습니까?')) return;

    logout(undefined, {
      onSuccess: () => {
        onSuccess?.();
        showToast('성공적으로 로그아웃되었습니다.');
      },
      onError: () => {
        showToast('로그아웃에 실패했습니다. 다시 시도해주세요.', 'error');
      },
    });
  };

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={isPending}>
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </Button>
  );
}

export default LogoutButton;
