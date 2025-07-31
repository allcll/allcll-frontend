import { useEffect, useRef } from 'react';
import { GeneralSchedule } from '@/hooks/server/useTimetableSchedules.ts';
import useBannerNotification from '@/store/useBannerNotification.tsx';

function useNotifyDeletedSchedule(schedules?: GeneralSchedule[]) {
  const isNotified = useRef<boolean>(false);
  const setBanner = useBannerNotification(state => state.setBanner);

  useEffect(() => {
    const isDeleted = schedules?.some(schedule => schedule.isDeleted);

    if (isDeleted && !isNotified.current) {
      isNotified.current = true;
      setBanner('삭제된 과목이 있습니다! 삭제된 과목은 회색으로 표시됩니다');
    }
  }, [schedules]);
}

export default useNotifyDeletedSchedule;
