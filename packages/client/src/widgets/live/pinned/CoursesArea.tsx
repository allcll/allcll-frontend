import { usePinned } from '@/hooks/server/usePinned';
import useFindWishes from '@/hooks/useFindWishes';
import { SSEType, useSseData } from '@/hooks/useSSEManager';
import NetworkError from '../errors/NetworkError';
import ZeroPinError from '../errors/ZeroPinError';
import RealtimeCard from './RealtimeCard';
import AlarmAddButton from './AlarmAddButton';
import { Button, Flex, Grid } from '@allcll/allcll-ui';

/**
 *feature
 * @returns
 */
function CoursesArea() {
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

export default CoursesArea;

function AlarmCountAlert() {
  return (
    <Flex justify="justify-center" align="items-center">
      <Button variant="ghost" size="medium" disabled={true}>
        알림 과목은 최대 5개까지 등록할 수 있어요.
      </Button>
    </Flex>
  );
}

function SkeletonBox() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 0, 0].map((_, idx) => (
        <div key={'skeleton-card-' + idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24" />
      ))}
    </div>
  );
}
