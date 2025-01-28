import {Subject} from '@/utils/types..ts';
import {useState} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const PinLimit = 5;

const DummyPinSubject: Subject[] = [
  {id: 1, code: 'CS101', name: '프로그래밍 기초', professor: '김교수', credits: 3, seats: 2},
  {id: 2, code: 'BA201', name: '경영학원론', professor: '이교수', credits: 3, seats: 0},
  {id: 3, code: 'CS201', name: '자료구조', professor: '박교수', credits: 3, seats: 5},
  {id: 4, code: 'BA201', name: '경영학원론', professor: '이교수', credits: 3, seats: 0},
  {id: 5, code: 'CS201', name: '자료구조', professor: '박교수', credits: 3, seats: 5},
];

function usePined() {
  const [pined, setPined] = useState<Subject[]>(DummyPinSubject);

  const addPined = (subject: Subject) => {
    if (pined.length >= PinLimit) {
      alert('핀 과목은 최대 5개까지만 가능합니다.');
      return;
    }

    setPined([...pined, subject]);
  };

  const removePined = (id: number) => {
    setPined(pined.filter((course) => course.id !== id));
  };

  return {pined, addPined, removePined};
}

export default usePined;


const fetchPinnedSubjects = async (): Promise<{ subjects: { subjectId: number; subjectName: string; subjectCode: string; }[] }> => {
  const response = await fetch('/api/pins', {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch pinned subjects');
  }
  return response.json();
};

export const usePinnedSubjects = () => {
  return useQuery(['pinnedSubjects'], fetchPinnedSubjects, {
    onError: (error) => {
      console.error('Error fetching pinned subjects:', error);
    },
  });
};

const addPinnedSubject = async (subjectId: number): Promise<void> => {
  const response = await fetch(`/api/pin?subjectId=${subjectId}`, {
    method: 'POST',
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to add pinned subject');
  }
};

export const useAddPinnedSubject = () => {
  const queryClient = useQueryClient();

  return useMutation(addPinnedSubject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pinnedSubjects']);
    },
    onError: (error) => {
      console.error('Error adding pinned subject:', error);
    },
  });
};

const removePinnedSubject = async (subjectId: number): Promise<void> => {
  const response = await fetch(`/api/pin?subjectId=${subjectId}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to remove pinned subject');
  }
};

export const useRemovePinnedSubject = () => {
  const queryClient = useQueryClient();

  return useMutation(removePinnedSubject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pinnedSubjects']);
    },
    onError: (error) => {
      console.error('Error removing pinned subject:', error);
    },
  });
};