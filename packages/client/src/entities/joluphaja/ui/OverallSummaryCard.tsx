import { Card, Flex, Badge } from '@allcll/allcll-ui';
import CircleCheckIcon from '@/assets/circle-check.svg?react';
import CircleXIcon from '@/assets/circle-x.svg?react';
import ProgressDoughnut from './ProgressDoughnut';
import type { UserInfo, GraduationCheckData } from '@/entities/joluphaja/api/graduation';
import { isMajorSatisfied, isGeneralSatisfied } from '@/entities/joluphaja/lib/rules';

interface OverallSummaryCardProps {
  userInfo: UserInfo;
  graduationData: GraduationCheckData;
}

interface StatusIconProps {
  passed: boolean;
  label: string;
}

function StatusIcon({ passed, label }: StatusIconProps) {
  return (
    <Flex direction="flex-col" align="items-center" gap="gap-2" className="md:flex-row">
      <div className={passed ? 'text-primary-500' : 'text-gray-400'}>
        {passed ? <CircleCheckIcon className="w-8 h-8" /> : <CircleXIcon className="w-8 h-8" />}
      </div>
      <span className="text-xs md:text-sm text-gray-600">{label}</span>
    </Flex>
  );
}

function OverallSummaryCard({ userInfo, graduationData }: OverallSummaryCardProps) {
  const { summary, categories, certifications } = graduationData;

  const majorPassed = isMajorSatisfied(categories);
  const generalPassed = isGeneralSatisfied(categories, userInfo.studentId);
  const certificationPassed = certifications.isSatisfied;

  return (
    <Card variant="outlined" className="p-6 md:p-10 mb-6 md:mb-8">
      <Flex direction="flex-col" gap="gap-4" className="md:flex-row md:justify-between md:items-start">
        {/* 왼쪽: 텍스트 정보 */}
        <Flex direction="flex-col" gap="gap-3" className="md:flex-1">
          <Flex align="items-center" gap="gap-3">
            <span className="text-lg md:text-xl font-bold">전체 진행률</span>
            <Badge variant={graduationData.isGraduatable ? 'success' : 'warning'}>
              {graduationData.isGraduatable ? '졸업 가능' : '진행 중'}
            </Badge>
          </Flex>

          <div>
            {graduationData.isGraduatable ? (
              <p className="text-xl md:text-2xl font-bold">
                졸업 요건 <span className="text-primary-500">ALLCLL</span>
              </p>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-bold">
                  현재{' '}
                  <span className="text-primary-500">
                    {summary.totalCredits}/{summary.requiredTotalCredits}학점
                  </span>{' '}
                  이수 완료
                </p>
                <p className="text-sm text-gray-500 mt-1">졸업까지 {summary.remainingCredits}학점</p>
              </>
            )}
          </div>

          <Flex direction="flex-col" gap="gap-1" className="text-sm text-gray-600 md:mt-2">
            <Flex gap="gap-2">
              <span className="text-gray-500 w-12">이름</span>
              <span>{userInfo.studentName}</span>
            </Flex>
            <Flex gap="gap-2">
              <span className="text-gray-500 w-12">학번</span>
              <span>{userInfo.studentId}</span>
            </Flex>
            <Flex gap="gap-2">
              <span className="text-gray-500 w-12">학과</span>
              <span>{userInfo.deptName}</span>
            </Flex>
          </Flex>
        </Flex>

        {/* 오른쪽: 상태 아이콘 + 도넛 */}
        <Flex direction="flex-col" className="md:flex-row md:items-center md:gap-24">
          <Flex justify="justify-between" className="md:flex-col md:gap-6 py-4 px-5 md:p-0">
            <StatusIcon passed={majorPassed} label="전공" />
            <StatusIcon passed={generalPassed} label="교양" />
            <StatusIcon passed={certificationPassed} label="졸업인증" />
          </Flex>

          <Flex justify="justify-center" className="py-4 md:py-0">
            <ProgressDoughnut earned={summary.totalCredits} required={summary.requiredTotalCredits} size="large" />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default OverallSummaryCard;
