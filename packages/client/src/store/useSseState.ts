import { create } from 'zustand';

export enum SSE_STATE {
  IDLE = 'idle',
  LIVE = 'live',
  // PRE_SEAT = 'preseat',
}

const NODATA_TIME_MS = 7000;
let timer: NodeJS.Timeout | null = null;

interface IUseSSEState {
  lastUpdate: Date | null;
  sseState: SSE_STATE;
  updated: () => void;
}

export const useSSEState = create<IUseSSEState>(set => ({
  lastUpdate: new Date(),
  sseState: SSE_STATE.LIVE,
  updated: () => {
    set({ lastUpdate: new Date(), sseState: SSE_STATE.LIVE });

    if (timer) {
      clearInterval(timer);
    }

    timer = setTimeout(() => {
      set({ sseState: SSE_STATE.IDLE });
      timer = null;
    }, NODATA_TIME_MS);
  },
}));
