import React from 'react';
import { create } from 'zustand';

export type ISetBanner = (children: React.ReactNode, onClose?: () => void) => void;

interface IUseBannerNotification {
  banner: React.ReactNode;
  onClose: (() => void) | undefined;
  setBanner: ISetBanner;
  closeBanner: () => void;
}

const useBannerNotification = create<IUseBannerNotification>(set => ({
  banner: null,
  onClose: undefined,
  setBanner: (banner, onClose) => set({ banner, onClose }),
  closeBanner: () => set({ banner: null }),
}));

export default useBannerNotification;
