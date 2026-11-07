import { OPERATION_TYPE_LABEL, type OperationType } from '@allcll/common';

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
  return OPERATION_TYPE_LABEL[operationType];
}
