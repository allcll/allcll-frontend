import { Wishes } from '@/utils/types';
import { useWishesTableStore } from '../model/useWishTableColumnStore';
import { IPreRealSeat } from '@/features/live/preseat/api/usePreRealSeats';
import usePreSeatGate from '@/features/live/preseat/lib/usePreSeatGate';

/** 사용하는 헤더를 반환해줍니다. 기간에 따라, wishes, pre-seats 변경 가능 */
function useHeaderSelector(data: Wishes[] | (Wishes & IPreRealSeat)[] | null | undefined) {
  const tableTitles = useWishesTableStore(state => state.tableTitles);
  const hasPreSeats = !!(data && data[0] && 'seat' in data[0]);
  const isWishesAvailable = data && data[0] && 'totalCount' in data[0];
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasPreSeats });

  let visibleCols = [{ title: '', visible: true, key: '' }, ...tableTitles.filter(col => col.visible)];
  if (!isWishesAvailable) {
    visibleCols = visibleCols.filter(header => header.key !== 'totalCount');
  }
  if (!isPreSeatAvailable) {
    visibleCols = visibleCols.filter(header => header.key !== 'seat');
  }

  return visibleCols;
}

export default useHeaderSelector;
