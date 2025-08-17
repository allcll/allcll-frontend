export type PreSeatMode = 'force-open' | 'auto' | 'force-close';
export const PRESEAT_MODE: PreSeatMode = 'force-open';

/**
 * preSeat의 가용성을 판단하는 훅입니다.
 * force-close: 항상 비활성화합니다.
 * force-open: 항상 활성화합니다.
 * auto: hasSeats가 true면 활성화, false면 비활성화합니다.
 * @param opts
 * @returns
 */
function usePreSeatGate(opts?: { hasSeats?: boolean }) {
  const { hasSeats } = opts ?? {};

  const getPreSeatAvailable = () => {
    if (PRESEAT_MODE === 'force-close') {
      return false;
    }

    if (PRESEAT_MODE === 'force-open') {
      return true;
    }

    return Boolean(hasSeats);
  };

  const isPreSeatAvailable = getPreSeatAvailable();

  return { isPreSeatAvailable };
}

export default usePreSeatGate;
