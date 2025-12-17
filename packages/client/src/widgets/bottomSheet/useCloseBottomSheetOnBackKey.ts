import { useNavigate } from 'react-router-dom';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { useEffect } from 'react';

function useCloseBottomSheetOnBackKey() {
  const { cancelSchedule } = useScheduleModal();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/timetable');
    cancelSchedule();
  };

  useEffect(() => {
    window.addEventListener('popstate', handleBack);
    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, []);
}

export default useCloseBottomSheetOnBackKey;
