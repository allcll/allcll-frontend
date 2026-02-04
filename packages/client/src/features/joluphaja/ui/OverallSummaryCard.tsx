import { Card, Flex, Badge } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile';
import CircleCheckIcon from '@/assets/circle-check.svg?react';
import CircleXIcon from '@/assets/circle-x.svg?react';
import ProgressDoughnut from './ProgressDoughnut';
import type { UserInfo, GraduationCheckData } from '@/entities/joluphaja/api/graduation';
import { isMajorSatisfied, isGeneralSatisfied } from '../lib/mappers';

interface OverallSummaryCardProps {
  userInfo: UserInfo;
  graduationData: GraduationCheckData;
}

interface StatusIconProps {
  passed: boolean;
  label?: string;
}

function StatusIcon({ passed, label }: StatusIconProps) {
  return (
    <Flex direction="flex-col" align="items-center" gap="gap-2">
      <div className={passed ? 'text-primary-500' : 'text-gray-400'}>
        {passed ? <CircleCheckIcon className="w-8 h-8" /> : <CircleXIcon className="w-8 h-8" />}
      </div>
      {label && <span className="text-xs text-gray-600">{label}</span>}
    </Flex>
  );
}

function OverallSummaryCard({ userInfo, graduationData }: OverallSummaryCardProps) {
  const isMobile = useMobile();
  const { summary, categories, certifications } = graduationData;

  const majorPassed = isMajorSatisfied(categories);
  const generalPassed = isGeneralSatisfied(categories, userInfo.studentId);
  const certificationPassed = certifications.isSatisfied;

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <Card variant="outlined" className="p-6 mb-6">
        <Flex direction="flex-col" gap="gap-4">
          <Flex justify="justify-between" align="items-center">
            <span className="text-lg font-bold">전체 진행률</span>
            <Badge variant={graduationData.isGraduatable ? 'success' : 'warning'}>
              {graduationData.isGraduatable ? '졸업 가능' : '진행 중'}
            </Badge>
          </Flex>

          <div>
            {graduationData.isGraduatable ? (
              <p className="text-xl font-bold">
                졸업 요건 <span className="text-primary-500">ALLCLL</span>
              </p>
            ) : (
              <>
                <p className="text-xl font-bold">
                  현재{' '}
                  <span className="text-primary-500">
                    {summary.totalCredits}/{summary.requiredTotalCredits}학점
                  </span>
                  이수완료
                </p>
                <p className="text-sm text-gray-500 mt-1">졸업까지 {summary.remainingCredits}학점</p>
              </>
            )}
          </div>

          <Flex direction="flex-col" gap="gap-1" className="text-sm text-gray-600">
            <span>이름: {userInfo.studentName}</span>
            <span>학과: {userInfo.deptName}</span>
            <span>학번: {userInfo.studentId}</span>
          </Flex>

          <Flex justify="justify-between" className="py-4 px-5">
            <StatusIcon passed={majorPassed} label="전공" />
            <StatusIcon passed={generalPassed} label="교양" />
            <StatusIcon passed={certificationPassed} label="졸업인증" />
          </Flex>

          <Flex justify="justify-center" className="py-4">
            <ProgressDoughnut earned={summary.totalCredits} required={summary.requiredTotalCredits} size="large" />
          </Flex>
        </Flex>
      </Card>
    );
  }

  // 데스크톱 레이아웃
  return (
    <Card variant="outlined" className="p-10 mb-8">
      <Flex justify="justify-between" align="items-start">
        <Flex direction="flex-col" gap="gap-3" className="flex-1">
          <Flex align="items-center" gap="gap-3">
            <span className="text-xl font-bold">전체 진행률</span>
            <Badge variant={graduationData.isGraduatable ? 'success' : 'warning'}>
              {graduationData.isGraduatable ? '졸업 가능' : '진행 중'}
            </Badge>
          </Flex>

          <div>
            {graduationData.isGraduatable ? (
              <p className="text-2xl font-bold">
                졸업 요건 <span className="text-primary-500">ALLCLL</span>
              </p>
            ) : (
              <>
                <p className="text-2xl font-bold">
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

          <Flex direction="flex-col" gap="gap-1" className="text-sm text-gray-600 mt-2">
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

        <Flex align="items-center" gap="gap-24">
          <Flex direction="flex-col" gap="gap-6">
            <Flex align="items-center" gap="gap-2">
              <StatusIcon passed={majorPassed} />
              <span className="text-sm">전공</span>
            </Flex>
            <Flex align="items-center" gap="gap-2">
              <StatusIcon passed={generalPassed} />
              <span className="text-sm">교양</span>
            </Flex>
            <Flex align="items-center" gap="gap-2">
              <StatusIcon passed={certificationPassed} />
              <span className="text-sm">졸업 인증</span>
            </Flex>
          </Flex>

          <ProgressDoughnut earned={summary.totalCredits} required={summary.requiredTotalCredits} size="large" />
        </Flex>
      </Flex>
    </Card>
  );
}

export default OverallSummaryCard;
