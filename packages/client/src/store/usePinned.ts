import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api.ts';

const PinLimit = 5;

export function usePinned() {
  return useQuery({
    queryKey: ['pinnedSubjects'],
    queryFn: fetchPinnedSubjects,
    select: data => data.subjects,
  });
}

export const useAddPinned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPinnedSubject,
    onMutate: async subjectId => {
      await queryClient.cancelQueries({ queryKey: ['pinnedSubjects'] });
      const previousPined = queryClient.getQueryData<PinnedSubjectResponse>(['pinnedSubjects'])?.subjects ?? [];

      if (previousPined && previousPined.length >= PinLimit) {
        throw new Error(
          JSON.stringify({
            message: `알림 과목은 최대 ${PinLimit}개까지만 가능합니다.`,
          }),
        );
      }

      if (previousPined) {
        const newPin = { ...previousPined[0], subjectId };

        queryClient.setQueryData<PinnedSubjectResponse>(['pinnedSubjects'], {
          subjects: [...previousPined, newPin],
        });
        previousPined.push(newPin);
      }

      return { previousUsers: previousPined };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinnedSubjects'] }).then();
    },
    onError: error => {
      try {
        const e = JSON.parse(error.message);
        alert(e.message);
      } catch {
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
      const previousData = queryClient.getQueryData<PinnedSubjectResponse>(['pinnedSubjects']);

      if (previousData) {
        const updatedSubjects = previousData.subjects.filter(subject => subject.subjectId !== subjectId);
        queryClient.setQueryData<PinnedSubjectResponse>(['pinnedSubjects'], { subjects: updatedSubjects });
      }

      return { previousData };
    },
    onSettled: () => {
      console.log('pin removed onSettled');
      queryClient.invalidateQueries({ queryKey: ['pinnedSubjects'] }).then();
    },
    onError: error => {
      console.error('Error removing pinned subject:', error);
    },
  });
};

interface PinnedSubject {
  subjectId: number;
}

interface PinnedSubjectResponse {
  subjects: PinnedSubject[];
}

const fetchPinnedSubjects = async () => {
  return await fetchJsonOnAPI<PinnedSubjectResponse>('/api/pins');
};

const addPinnedSubject = async (subjectId: number) => {
  const response = await fetchOnAPI(`/api/pin?subjectId=${subjectId}`, { method: 'POST' });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

const removePinnedSubject = async (subjectId: number) => {
  const response = await fetchOnAPI(`/api/pin/${subjectId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};
