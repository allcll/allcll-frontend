import { useCheckSessionAlive } from '@/hooks/server/session/useCheckService';
import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';
import { SystemStatusKey } from '@/pages/Dashboard';

export const useSystemStatus = () => {
  const { data: isActiveSession } = useCheckSessionAlive();
  const { data: activeSeat } = useCheckCrawlerSeat();
  const { data: isSentSseData } = useCheckSseScheduler();

  const statusData: Record<SystemStatusKey, { active: boolean; description?: string }> = {
    [SystemStatusKey.SESSION]: {
      active: !!isActiveSession,
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
