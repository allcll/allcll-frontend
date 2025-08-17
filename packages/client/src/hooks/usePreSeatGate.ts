export type PreSeatMode = 'force-off' | 'auto' | 'force-on';
export const PRESEAT_MODE: PreSeatMode = 'force-on';

/**
 * preSeat의 가용성을 판단하는 훅입니다.
 * force-off: 항상 비활성화합니다.
 * force-on: 항상 활성화합니다.
 * auto: hasSeats가 true면 활성화, false면 비활성화합니다.
 *
 * @param mode
 * @param opts
 * @returns
 */
function usePreSeatGate(opts?: { hasSeats?: boolean }) {
  const { hasSeats } = opts ?? {};

  const getPreSeatAvailable = () => {
    if (PRESEAT_MODE === 'force-off') {
      return false;
    }

    if (PRESEAT_MODE === 'force-on') {
      return true;
    }

    return Boolean(hasSeats);
  };

  const isPreSeatAvailable = getPreSeatAvailable();

  return { isPreSeatAvailable };
}

export default usePreSeatGate;
