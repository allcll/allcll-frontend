import { useMutation } from '@tanstack/react-query';

const checkGraduation = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/graduation/check', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

export const useGraduationCheckMutation = () => {
  return useMutation({
    mutationFn: checkGraduation,
  });
};
