import { CURRENT_SEMESTER } from '@allcll/common';
import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';
import type {
  IOperationPeriodDetail,
  IOperationPeriodsResponse,
} from '@/entities/operationPeriod/model/operationPeriod';
import type { ServicePeriod, ServiceSemesters } from '@/entities/semester/api/semester';

/**
 * 서비스의 운영 기간을 조회합니다. serviceId 를 넘기면 해당 서비스만 골라 돌려줍니다.
 *
 * 어드민에서 기간을 등록하지 않은 서비스는 목록에 없으며, 이 경우 사용하는 쪽에서 제한 없이 엽니다.
 */
function useServiceSemester(serviceId?: string) {
  const query = useOperationPeriods();
  const semester = query.data && toServiceSemesters(query.data);

  if (!serviceId) return { ...query, data: semester };

  return {
    ...query,
    data: semester && {
      semesterCode: semester.semesterCode,
      semesterValue: semester.semesterValue,
      service: semester.services.find(service => service.id === serviceId),
    },
  };
}

const toServiceSemesters = (response: IOperationPeriodsResponse): ServiceSemesters => ({
  semesterCode: response.semesterCode ?? CURRENT_SEMESTER.semesterCode,
  semesterValue: response.semesterKoreanName ?? CURRENT_SEMESTER.semesterValue,
  services: (response.operationPeriodDetailResponses ?? []).map(toServicePeriod),
});

/**
 * 서버의 운영 기간을 화면에서 쓰는 형태로 바꿉니다.
 * 서비스 식별자는 소문자(`live`, `baskets`)로 다루므로 운영 타입(`LIVE`)을 변환합니다.
 */
const toServicePeriod = (period: IOperationPeriodDetail): ServicePeriod => {
  const now = new Date();
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);

  // 하루 단위로 비교하기 위해 시작은 자정, 종료는 그날 마지막 순간으로 맞춥니다.
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    id: period.operationType.toLowerCase(),
    startDate,
    endDate,
    withinPeriod: startDate <= now && now <= endDate,
    // 서버는 시각까지 내려주지만 화면에는 날짜만 보여줍니다.
    startDateStr: period.startDate.split('T')[0],
    endDateStr: period.endDate.split('T')[0],
    message: period.message,
  };
};

export default useServiceSemester;
