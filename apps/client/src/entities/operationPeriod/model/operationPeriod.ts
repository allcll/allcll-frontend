export type OperationType = 'TIMETABLE' | 'BASKETS' | 'SIMULATION' | 'LIVE' | 'PRESEAT';

export interface IOperationPeriodDetail {
  operationType: OperationType;
  startDate: string;
  endDate: string;
  message: string | null;
}

export interface IOperationPeriodsResponse {
  semesterCode: string | null;
  semesterKoreanName: string | null;
  operationPeriodDetailResponses: IOperationPeriodDetail[];
}
