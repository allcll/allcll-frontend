export const NOTICE_TYPE_LABEL = {
  ALL: '전체',
  TIMETABLE: '시간표',
  BASKETS: '관심과목',
  SIMULATION: '수강신청 연습',
  LIVE: '실시간 여석',
  PRESEAT: '사전좌석',
  GRADUATION: '졸업요건',
  REVIEW: '후기',
} as const;

export type OperationType = keyof typeof NOTICE_TYPE_LABEL;

export interface Notice {
  id: number;
  title: string;
  content: string;
  operationType: OperationType;
  createdAt: string;
  updatedAt: string;
}

export interface NoticesResponse {
  notices: Notice[];
}

export function getNoticeLabel(operationType: OperationType): string {
  return NOTICE_TYPE_LABEL[operationType];
}
