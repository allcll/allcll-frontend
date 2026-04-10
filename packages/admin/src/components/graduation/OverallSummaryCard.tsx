import { Card, Flex, Badge, SupportingText } from '@allcll/allcll-ui';
import CircleCheckIcon from '@/assets/circle-check.svg?react';
import CircleXIcon from '@/assets/circle-x.svg?react';
import ProgressDoughnut from './ProgressDoughnut';
import type { AdminGraduationViewResponse } from '@/hooks/server/graduation/useAdminGraduationView';
import { MAJOR_CATEGORY_TYPES, GENERAL_CATEGORY_TYPES } from './lib/rules';

type User = AdminGraduationViewResponse['user'];
type CheckData = AdminGraduationViewResponse['checkData'];

interface StatusIconProps {
  passed: boolean;
  label: string;
}

function StatusIcon({ passed, label }: Readonly<StatusIconProps>) {
  return (
    <Flex direction="flex-col" align="items-center" gap="gap-2" className="md:flex-row">
      <div className={passed ? 'text-primary-500' : 'text-gray-400'}>
        {passed ? <CircleCheckIcon className="w-8 h-8" /> : <CircleXIcon className="w-8 h-8" />}
      </div>
      <span className="text-xs md:text-sm text-gray-600">{label}</span>
    </Flex>
  );
}

interface OverallSummaryCardProps {
  user: User;
  checkData: CheckData;
}

function OverallSummaryCard({ user, checkData }: Readonly<OverallSummaryCardProps>) {
  const { summary, categories, certifications } = checkData;

  const majorPassed = categories.filter(c => MAJOR_CATEGORY_TYPES.includes(c.categoryType)).every(c => c.satisfied);
  const generalPassed = categories.filter(c => GENERAL_CATEGORY_TYPES.includes(c.categoryType)).every(c => c.satisfied);
  const certificationPassed = certifications.isSatisfied;

  return (
    <Card variant="outlined" className="p-6 md:p-10">
      <Flex direction="flex-col" gap="gap-4" className="md:flex-row md:justify-between md:items-center">
        <Flex direction="flex-col" gap="gap-3" className="md:flex-1">
          <Flex align="items-center" gap="gap-3">
            <SupportingText>전체 진행률</SupportingText>
            <Badge variant={checkData.isGraduatable ? 'success' : 'warning'}>
              {checkData.isGraduatable ? '졸업 가능' : '진행 중'}
            </Badge>
          </Flex>

          <div>
            {checkData.isGraduatable ? (
              <p className="text-xl md:text-2xl font-bold">
                졸업 요건 <span className="text-primary-500">ALLCLL</span>
              </p>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-bold">
                  현재{' '}
                  <span className="text-primary-500">
                    {summary.totalMyCredits}/{summary.requiredTotalCredits}학점
                  </span>{' '}
                  이수 완료
                </p>
                <p className="text-sm text-gray-600 mt-1">졸업까지 {summary.remainingCredits}학점 남았습니다.</p>
              </>
            )}
          </div>

          <Flex direction="flex-col" gap="gap-1" className="text-sm text-gray-600 md:mt-2">
            <Flex gap="gap-2">
              <span className="text-gray-500 w-16 shrink-0">이름</span>
              <span>{user.name}</span>
            </Flex>
            <Flex gap="gap-2">
              <span className="text-gray-500 w-16 shrink-0">학번</span>
              <span>{user.studentId}</span>
            </Flex>
            <Flex gap="gap-2">
              <span className="text-gray-500 w-16 shrink-0">학과</span>
              <span>
                {user.deptName} ({user.collegeName})
              </span>
            </Flex>
            {user.doubleDeptName && (
              <Flex gap="gap-2">
                <span className="text-gray-500 w-16 shrink-0">복수전공</span>
                <span>
                  {user.doubleDeptName} ({user.doubleCollegeName})
                </span>
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex direction="flex-col" className="md:flex-row md:items-center md:gap-24">
          <Flex justify="justify-between" className="md:flex-col md:gap-6 py-4 px-5 md:p-0">
            <StatusIcon passed={majorPassed} label="전공" />
            <StatusIcon passed={generalPassed} label="교양" />
            <StatusIcon passed={certificationPassed} label="졸업인증" />
          </Flex>

          <Flex justify="justify-center" className="py-4 md:py-0">
            <ProgressDoughnut earned={summary.totalMyCredits} required={summary.requiredTotalCredits} size="large" />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default OverallSummaryCard;
