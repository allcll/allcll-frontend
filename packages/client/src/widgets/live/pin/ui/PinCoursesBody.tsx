import { usePinned } from '@/entities/subjects/model/capabilities/usePinned.ts';
import useFindWishes from '@/entities/wishes/lib/useFindWishes.ts';
import { SSEType, useSseData } from '@/features/live/common/api/useSSEManager';
import { Grid, Skeleton } from '@allcll/allcll-ui';
import RealtimeCard from '@/features/live/pin/ui/RealtimeCard';
import AlarmAddButton from '@/features/live/pin/ui/AlarmAddButton';

import NetworkError from '../../_errors/ui/NetworkError';
import ZeroPinError from '../../_errors/ui/ZeroPinError';
import AlarmCountAlert from '@/features/live/pin/ui/AlarmCountAlert';

function PinCoursesBody() {
  const { data, isPending, isError, refetch } = usePinned();
  const { data: pinnedSeats } = useSseData(SSEType.PINNED);

  const pinnedWishes = useFindWishes(data?.map(pinned => pinned.subjectId) ?? []);

  const getSeats = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.seatCount ?? -1;
  };

  const getQueryTime = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.queryTime ?? '';
  };

  if (isPending) {
    return <SkeletonBox />;
  }

  if (isError) {
    return <NetworkError onReload={refetch} />;
  }

  if (!pinnedWishes || pinnedWishes.length === 0) {
    return <ZeroPinError />;
  }

  return (
    <Grid columns={{ base: 1, md: 3 }} gap="gap-4">
      {pinnedWishes.map(subject => (
        <RealtimeCard
          key={`${subject.subjectId}_${subject.subjectCode}_${subject.professorName}`}
          subject={subject}
          seats={getSeats(subject.subjectId)}
          queryTime={getQueryTime(subject.subjectId)}
        />
      ))}
      {pinnedWishes.length < 5 ? <AlarmAddButton /> : <AlarmCountAlert />}
    </Grid>
  );
}

export default PinCoursesBody;

function SkeletonBox() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap="gap-4">
      {[0, 0, 0].map((_, idx) => (
        <Skeleton key={'skeleton-card-' + idx} className="h-24 rounded-lg" />
      ))}
    </Grid>
  );
}
