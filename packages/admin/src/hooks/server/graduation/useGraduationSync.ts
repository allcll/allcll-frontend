import { fetchOnAPI } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';

import { addRequestLog } from '@/utils/log/adminApiLogs';
import { useToastNotification } from '@allcll/common';

const syncGraduation = async () => {
  const response = await fetchOnAPI('/api/admin/graduation/sync', {
    method: 'POST',
  });

  const responseBody = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', '');
    throw new Error(responseBody);
  }

  await addRequestLog(response, 'POST', '');

  return response;
};

export function useGraduationSync() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: syncGraduation,
    onSuccess: () => {
      toast('졸업요건 데이터가 동기화되었습니다.');
    },
    onError: err => console.error(err),
  });
}

export default useGraduationSync;
