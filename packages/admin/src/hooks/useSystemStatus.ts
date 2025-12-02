import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';
import { SystemStatusKey } from '@/pages/Dashboard';
import { useCheckAdminSession } from './server/session/useAdminSession';

export const useSystemStatus = () => {
  const { data: isActiveSession } = useCheckAdminSession();
  const { data: activeSeat } = useCheckCrawlerSeat();
  const { data: isSentSseData } = useCheckSseScheduler();

  const statusData: Record<SystemStatusKey, { active: boolean; description?: string }> = {
    [SystemStatusKey.SESSION]: {
      active: !!isActiveSession?.some(session => session.isActive),
    },
    [SystemStatusKey.SEAT]: {
      active: !!activeSeat?.isActive,
      description: activeSeat?.userId ? `userId: ${activeSeat.userId}` : undefined,
    },
    [SystemStatusKey.SSE_CONNECTION]: {
      active: false,
    },
    [SystemStatusKey.SSE_DATA]: {
      active: !!isSentSseData,
    },
  };

  return statusData;
};
