import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface IUseConfirm {
  request: (ConfirmOptions & { resolve: (confirmed: boolean) => void }) | null;
}

const useConfirm = create<IUseConfirm>(() => ({ request: null }));

export function confirm(options: ConfirmOptions) {
  return new Promise<boolean>(resolve => {
    useConfirm.getState().request?.resolve(false);
    useConfirm.setState({ request: { ...options, resolve } });
  });
}

export function settleConfirm(confirmed: boolean) {
  const { request } = useConfirm.getState();
  if (!request) return;

  request.resolve(confirmed);
  useConfirm.setState({ request: null });
}

export default useConfirm;
