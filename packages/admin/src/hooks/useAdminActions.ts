import { useCancelSessionKeepAlive, useStartSessionKeepAlive } from '@/hooks/server/session/useSessionKeepAlive';
import {
  useCancelCrawlersSeat,
  useStartCrawlersSeat,
  useStartSeasonCrawlersSeat,
} from '@/hooks/server/clawlers/useSeatClawlers';
import { useCancelSseScheduler, useStartSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

export function useAdminActions() {
  const { mutate: startSession } = useStartSessionKeepAlive();
  const { mutate: cancelSession } = useCancelSessionKeepAlive();

  const { mutate: startCrawlers } = useStartCrawlersSeat();
  const { mutate: startSeasonCrawlers } = useStartSeasonCrawlersSeat();
  const { mutate: cancelCrawlers } = useCancelCrawlersSeat();

  const { mutate: startSse } = useStartSseScheduler();
  const { mutate: cancelSse } = useCancelSseScheduler();

  return {
    session: {
      start: startSession,
      stop: cancelSession,
    },
    seat: {
      start: startCrawlers,
      startSeason: startSeasonCrawlers,
      stop: cancelCrawlers,
    },
    sse: {
      start: startSse,
      stop: cancelSse,
    },
  };
}
