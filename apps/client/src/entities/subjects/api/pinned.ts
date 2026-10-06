import { fetchJsonOnAPI, fetchOnAPI } from '@/shared/api/api.ts';

interface PinnedSubject {
  subjectId: number;
}

export interface PinnedSubjectResponse {
  subjects: PinnedSubject[];
}

export const fetchPinnedSubjects = async () => {
  return await fetchJsonOnAPI<PinnedSubjectResponse>('/api/pins');
};

export const addPinnedSubject = async (subjectId: number) => {
  const response = await fetchOnAPI(`/api/pin?subjectId=${subjectId}`, { method: 'POST' });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

export const removePinnedSubject = async (subjectId: number) => {
  const response = await fetchOnAPI(`/api/pin/${subjectId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};
