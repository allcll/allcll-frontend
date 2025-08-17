import { useMemo } from 'react';
import { Subject } from '@/utils/types.ts';
import usePreRealSeats, { InitPreRealSeat, IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import { InitSubject } from '@/hooks/server/useSubject.ts';

interface SubjectData {
  subjectId: number;
}

export function joinData<T extends SubjectData, U extends SubjectData>(
  dataA: T[] | undefined,
  dataB: U[] | undefined,
  DummyA: T | Exclude<T, 'subjectId'>,
  DummyB: U | Exclude<U, 'subjectId'>,
) {
  if (!dataA || !dataB) return dataA || dataB;

  const sortedA = dataA.sort((a, b) => a.subjectId - b.subjectId);
  const sortedB = dataB.sort((a, b) => a.subjectId - b.subjectId);

  const joinedData: (T & U)[] = [];
  let i = 0,
    j = 0;
  while (i < sortedA.length && j < sortedB.length) {
    if (sortedA[i].subjectId === sortedB[j].subjectId) {
      joinedData.push({ ...sortedA[i++], ...sortedB[j++] });
    } else if (sortedA[i].subjectId < sortedB[j].subjectId) {
      joinedData.push({ ...DummyB, ...sortedA[i++] });
    } else {
      joinedData.push({ ...DummyA, ...sortedB[j++] });
    }
  }

  while (i < sortedA.length) {
    joinedData.push({ ...DummyB, ...sortedA[i++] });
  }

  while (j < sortedB.length) {
    joinedData.push({ ...DummyA, ...sortedB[j++] });
  }

  return joinedData;
}

export function useJoinPreSeats<T extends Subject>(
  data: T[] | undefined,
  dummy: T | Exclude<T, 'subjectId'>,
): (T | (IPreRealSeat & T))[] | undefined {
  const { data: preSeats } = usePreRealSeats();

  return useMemo(() => {
    if (!data || !preSeats?.length) return data;
    return joinData(data, preSeats, dummy ?? InitSubject, InitPreRealSeat) as (IPreRealSeat & T)[];
  }, [data, preSeats, dummy]);
}
