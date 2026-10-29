import { NonMajorSeats, PinnedSeats } from '@/shared/model/types.ts';

type SSESeats = NonMajorSeats | PinnedSeats;

function mergeUpdatedOnly<T extends SSESeats>(prev: T[], next: T[]) {
  const updated: T[] = [];

  for (const nextItem of next) {
    const prevItem = prev.find(p => p.subjectId === nextItem.subjectId);
    const isChanged =
      !prevItem || prevItem.seatCount !== nextItem.seatCount || prevItem.queryTime !== nextItem.queryTime;

    if (isChanged) {
      updated.push(nextItem);
    } else {
      updated.push(prevItem);
    }
  }

  return updated;
}

function mergeUpdated<T extends SSESeats>(prev: T[], next: T[]) {
  const ids = new Set<number>();

  [...prev, ...next].forEach(item => {
    ids.add(item.subjectId);
  });

  const result: T[] = [];
  ids.forEach(id => {
    const prevItem = prev.find(item => item.subjectId === id);
    const nextItem = next.find(item => item.subjectId === id);

    const isNextItem =
      nextItem && (!prevItem || prevItem.queryTime !== nextItem.queryTime || prevItem.seatCount !== nextItem.seatCount);

    if (isNextItem) {
      result.push(nextItem);
    } else if (prevItem) {
      result.push(prevItem);
    }
  });

  return result;
}

export { mergeUpdated, mergeUpdatedOnly };
