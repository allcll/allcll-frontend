import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGraduationCheck, graduationQueryKeys } from '@/entities/joluphaja/model/useGraduation';
import { useGraduationCheckMutation } from './useGraduationCheckMutation';
import useToastNotification from '@/features/notification/model/useToastNotification';

function useUploading(nextStep: () => void, prevStep: () => void, file: File | null) {
  const queryClient = useQueryClient();
  const { mutate: uploadFile, isPending: isUploading } = useGraduationCheckMutation();
  const { data, isLoading: isFetching, isError } = useGraduationCheck();
  const [progress, setProgress] = useState(0);
  const [uploadStarted, setUploadStarted] = useState(false);
  const addToast = useToastNotification(state => state.addToast);

  useEffect(() => {
    if (!file || uploadStarted) return;

    setUploadStarted(true);
    queryClient.removeQueries({ queryKey: graduationQueryKeys.check() });

    uploadFile(file, {
      onError: () => {
        addToast('파일 업로드에 실패했습니다. 다시 시도해주세요.');
        prevStep();
      },
    });
  }, [file, uploadStarted, uploadFile, queryClient, addToast, prevStep]);

  // 프로그레스 바: 업로드 중 (0~60%)
  useEffect(() => {
    if (!isUploading) return;

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 3, 60));
    }, 100);

    return () => clearInterval(interval);
  }, [isUploading]);

  // 프로그레스 바: 분석 중 (60~90%)
  useEffect(() => {
    if (!isFetching || isUploading) return;

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 90));
    }, 200);

    return () => clearInterval(interval);
  }, [isFetching, isUploading]);

  // 프로그레스 바: 완료 (90~100%)
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (progress === 100 && data) {
      const timeout = setTimeout(nextStep, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, data, nextStep]);

  // 에러 처리
  useEffect(() => {
    if (isError) {
      addToast('졸업 요건 검사 결과를 불러오는데 실패했습니다.');
      prevStep();
    }
  }, [isError, addToast, prevStep]);

  const message = isUploading
    ? '파일을 업로드하는 중입니다...'
    : isFetching
      ? '업로드된 파일을 분석하고 있습니다...'
      : data
        ? '분석이 완료되었습니다!'
        : '결과를 불러오는 중입니다...';

  return { progress, message };
}

export default useUploading;
