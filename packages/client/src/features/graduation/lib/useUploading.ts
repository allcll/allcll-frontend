import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { graduationQueryKeys, useGraduationCheck } from '@/entities/graduation/model/useGraduation';
import { useGraduationCheckMutation } from './useGraduationCheckMutation';
import useToastNotification from '@/features/notification/model/useToastNotification';

type Phase = 'uploading' | 'fetching' | 'done';

function useUploading(nextStep: () => void, prevStep: () => void, file: File | null) {
  const queryClient = useQueryClient();
  const { mutate: uploadFile } = useGraduationCheckMutation();
  const [phase, setPhase] = useState<Phase>('uploading');
  const { data, isError } = useGraduationCheck(phase === 'fetching');
  const [uploadStarted, setUploadStarted] = useState(false);
  const addToast = useToastNotification(state => state.addToast);

  // 파일 업로드 시작
  useEffect(() => {
    if (!file || uploadStarted) return;

    setUploadStarted(true);

    uploadFile(file, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: graduationQueryKeys.check() });
        setPhase('fetching');
      },
      onError: () => {
        addToast('파일 업로드에 실패했습니다. 다시 시도해주세요.');
        prevStep();
      },
    });
  }, [file, uploadStarted, uploadFile, queryClient, addToast, prevStep]);

  // data가 도착하면 done으로 전환 후 결과 페이지로 이동
  useEffect(() => {
    if (data && phase === 'fetching') {
      setPhase('done');
      nextStep();
    }
  }, [data, phase, nextStep]);

  // 에러 처리: fetching phase에서만 동작 (캐시된 이전 에러 무시)
  useEffect(() => {
    if (isError && phase === 'fetching') {
      addToast('졸업 요건 검사 결과를 불러오는데 실패했습니다.');
      prevStep();
    }
  }, [isError, phase, addToast, prevStep]);

  const message = {
    uploading: '파일을 업로드하는 중입니다...',
    fetching: '업로드된 파일을 분석하고 있습니다...',
    done: '분석이 완료되었습니다. 검사 결과를 가져옵니다.',
  }[phase];

  return { message };
}

export default useUploading;
