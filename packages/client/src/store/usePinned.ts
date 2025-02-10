import {Subject} from '@/utils/types.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PinLimit = 5;

export function usePinned() {
  return useQuery({
    queryKey: ['pinnedSubjects'],
    queryFn: fetchPinnedSubjects,
    select: (data) => data.subjects,
  });
}

export const useAddPinned = () => {
  const queryClient = useQueryClient();

  // Todo: Add a mutation to add a pinned subject
  // Todo: 요청 전에 검사하는 기능 필요
  return useMutation({
    mutationFn: addPinnedSubject,
    onMutate: async (subjectId) => {
      await queryClient.cancelQueries({ queryKey: ['pinnedSubjects'] })
      const previousPined = queryClient.getQueryData<Subject[]>(['pinnedSubjects'])

      if (previousPined && previousPined.length >= PinLimit) {
        throw new Error(`핀 고정된 과목은 최대 ${PinLimit}개까지만 가능합니다.`);
      }

      if (previousPined) {
        const newPin = { ...previousPined[0], subjectId };

        queryClient.setQueryData<Subject[]>(['users'], [...previousPined, newPin]);
        previousPined.push(newPin);
      }

      return { previousUsers: previousPined }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinnedSubjects'] });
    },
    onError: (error) => {
      try {
        const e = JSON.parse(error.message)
        alert(e.message);
      }
      catch {
        alert('Error adding pinned subject');
      }
    },
  });
};

export const useRemovePinned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePinnedSubject,
    onMutate: async (subjectId: number) => {
      await queryClient.cancelQueries({ queryKey: ['pinnedSubjects'] });
      const previousPined = queryClient.getQueryData<Subject[]>(['pinnedSubjects']);

      if (previousPined) {
        queryClient.setQueryData<Subject[]>(['pinnedSubjects'], previousPined.filter((subject) => subject.subjectId !== subjectId));
      }

      return { previousPined };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinnedSubjects'] });
    },
    onError: (error) => {
      console.error('Error removing pinned subject:', error);
    },
  });
};

interface PinnedSubjectResponse {
  subjects: Subject[];
}

const fetchPinnedSubjects = async (): Promise<PinnedSubjectResponse> => {
  const response = await fetch('/api/pins', {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

const addPinnedSubject = async (subjectId: number): Promise<void> => {
  const response = await fetch(`/api/pin?subjectId=${subjectId}`, {
    method: 'POST',
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
};

const removePinnedSubject = async (subjectId: number): Promise<void> => {
  const response = await fetch(`/api/pin/${subjectId}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
};
