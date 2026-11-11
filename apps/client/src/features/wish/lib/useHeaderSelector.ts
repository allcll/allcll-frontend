import { Wishes } from '@/shared/model/types.ts';
import { useWishesTableStore } from '../model/useWishTableColumnStore';
import usePreRealSeats, { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import usePreSeatGate from '@/entities/seat/model/usePreSeatGate';

/** 사용하는 헤더를 반환해줍니다. 기간에 따라, wishes, pre-seats 변경 가능 */
function useHeaderSelector(data: Wishes[] | (Wishes & IPreRealSeat)[] | null | undefined) {
  const tableTitles = useWishesTableStore(state => state.tableTitles);
  const { data: preSeats } = usePreRealSeats();
  // 로딩 중이거나 검색 결과가 없어 행이 없을 때도 열 구성이 바뀌지 않도록 행 대신 원본 데이터 유무로 판단
  const firstRow = data?.[0];
  const hasPreSeats = firstRow ? 'seat' in firstRow : !!preSeats?.length;
  const isWishesAvailable = firstRow ? 'totalCount' in firstRow : true;
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
