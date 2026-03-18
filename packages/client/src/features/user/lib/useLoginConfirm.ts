import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import { useState } from 'react';

type LoginData = { studentId: string; password: string };

function useLoginConfirm({
  onLogin,
}: {
  onLogin: (data: LoginData) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<LoginData | null>(null);

    const { data: liveData } = useServiceSemester('live');
    const isLivePeriod = liveData && 'service' in liveData && liveData.service?.withinPeriod;


  const interceptSubmit = (data: LoginData) => {
    const hideDialog = localStorage.getItem('hideLoginConfirmDialog') === 'true';
    if (isLivePeriod && !hideDialog) {
      setPendingLogin(data);
      setShowConfirm(true);
      return;
    }
    
    onLogin(data);
  };

  const handleConfirm = () => {
    setShowConfirm(false);

    if (pendingLogin) {
      onLogin(pendingLogin);
      setPendingLogin(null);
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setPendingLogin(null);
  };

  return {
    showConfirm,
    interceptSubmit,
    handleConfirm,
    handleClose,
  };
}

export default useLoginConfirm;
