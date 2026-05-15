import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEnglishCertPass } from '@/entities/graduation/api/graduation';
import { graduationQueryKeys } from '@/entities/graduation/model/useGraduation';
import useToastNotification from '@/features/notification/model/useToastNotification';

export const useUpdateEnglishCertMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: updateEnglishCertPass,
    onSuccess: data => {
      queryClient.setQueryData(graduationQueryKeys.check(), data);
    },
    onError: () => {
      addToast('영어 인증 결과 변경에 실패했습니다.');
    },
  });
};
