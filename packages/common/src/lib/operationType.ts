export const OPERATION_TYPE_LABEL = {
  ALL: '전체',
  TIMETABLE: '시간표',
  BASKETS: '관심과목',
  SIMULATION: '올클연습',
  LIVE: '실시간 여석',
  PRESEAT: '전체 학년 여석',
  GRADUATION: '졸업요건',
  REVIEW: '후기',
} as const;

export type OperationType = keyof typeof OPERATION_TYPE_LABEL;
export const OPERATION_TYPES = Object.keys(OPERATION_TYPE_LABEL) as OperationType[];
