import { useState } from 'react';
import { Card, Flex, Heading, SupportingText, Label, Chip, Button, Grid, SearchableSelect } from '@allcll/allcll-ui';
import { useMutation } from '@tanstack/react-query';
import { useAdmissionYearDepartments } from '@/entities/graduation/model/useGraduation';
import { useFilteringDepartment } from '@/features/filtering/lib/useFilteringDepartment.ts';
import { matchOptionKeyword } from '@/shared/lib/search.ts';
import { JolupStepsProps } from '@/features/graduation/model/types.ts';
import { updateMe } from '@/entities/user/api/user';
import useToastNotification from '@/features/notification/model/useToastNotification';

type MajorType = 'SINGLE' | 'DOUBLE'; // 단일전공 | 복수전공

interface BasicInfoFormProps extends JolupStepsProps {
  isDepartmentNotFound?: boolean;
}

const BasicInfoForm = ({ nextStep, prevStep, isDepartmentNotFound }: BasicInfoFormProps) => {
  const [majorType, setMajorType] = useState<MajorType>('SINGLE');
  const [doubleMajorCode, setDoubleMajorCode] = useState<string>('');
  const [doubleMajorName, setDoubleMajorName] = useState<string>('');

  // 주전공 학과 (DEPARTMENT_NOT_FOUND 시)
  const [primaryDeptCode, setPrimaryDeptCode] = useState<string>('');
  const [primaryDeptName, setPrimaryDeptName] = useState<string>('');

  const { data: departments } = useAdmissionYearDepartments();
  const { mutate: saveBasicInfo, isPending } = useMutation({ mutationFn: updateMe });
  const showToast = useToastNotification.getState().addToast;

  const { filteredDepartments: majorDepartments } = useFilteringDepartment({ category: '전공', departments });
  // '전체학과'(코드 '')는 선택지가 아니므로 제외
  const departmentOptions = majorDepartments
    .filter(department => department.departmentCode !== '')
    .map(department => ({
      value: department.departmentCode,
      label: department.departmentName || '학과 정보 없음',
    }));

  const handleMajorTypeChange = (type: MajorType) => {
    setMajorType(type);
    if (type === 'SINGLE') {
      setDoubleMajorCode('');
      setDoubleMajorName('');
    }
  };

  const getDepartmentName = (departmentCode: string) =>
    departmentOptions.find(option => option.value === departmentCode)?.label ?? '';

  const handleDoubleMajorSelect = (departmentCode: string) => {
    setDoubleMajorCode(departmentCode);
    setDoubleMajorName(getDepartmentName(departmentCode));
  };

  const handlePrimaryDeptSelect = (departmentCode: string) => {
    setPrimaryDeptCode(departmentCode);
    setPrimaryDeptName(getDepartmentName(departmentCode));
  };

  const isFormValid =
    (majorType === 'SINGLE' || (majorType === 'DOUBLE' && doubleMajorCode !== '')) &&
    (!isDepartmentNotFound || primaryDeptCode !== '');

  const needsPatch = majorType === 'DOUBLE' || isDepartmentNotFound;

  const handleNextStep = () => {
    if (!needsPatch) {
      nextStep();
      return;
    }

    const requestData = {
      deptNm: isDepartmentNotFound ? primaryDeptName : null,
      majorType,
      doubleDeptNm: majorType === 'DOUBLE' ? doubleMajorName : null,
    };

    saveBasicInfo(requestData, {
      onSuccess: () => {
        nextStep();
      },
      onError: () => {
        showToast('학과 정보 저장에 실패했습니다. 다시 시도해주세요.', 'department-set-errror');
      },
    });
  };

  return (
    <Card variant="outlined" className="w-full mx-auto p-8">
      <Flex direction="flex-col" gap="gap-8">
        <div className="text-center space-y-2">
          <Heading level={2} size="xl">
            기본 정보 입력
          </Heading>
          <SupportingText>정확한 졸업 요건 검사를 위해 학적 정보를 입력해주세요.</SupportingText>
        </div>

        <Flex direction="flex-col" gap="gap-6">
          {/* 이수 유형 선택 */}
          <Flex direction="flex-col" gap="gap-2">
            <Label required>이수 유형</Label>
            <Grid columns={{ base: 2 }} gap="gap-2">
              <Chip
                label="단일전공"
                selected={majorType === 'SINGLE'}
                onClick={() => handleMajorTypeChange('SINGLE')}
              />
              <Chip
                label="복수전공"
                selected={majorType === 'DOUBLE'}
                onClick={() => handleMajorTypeChange('DOUBLE')}
              />
            </Grid>
          </Flex>

          {/* 주전공 학과 검색 (DEPARTMENT_NOT_FOUND 시) */}
          {isDepartmentNotFound && (
            <Flex direction="flex-col" gap="gap-2">
              <SupportingText>
                <span className="text-primary-500">26학번의 계열 단위</span>는 특정한 졸업요건이 존재하지 않아, 학과를
                선택해주셔야합니다.
              </SupportingText>
              <Label required>주전공 학과</Label>
              <SearchableSelect
                className="w-full"
                options={departmentOptions}
                value={primaryDeptCode}
                onChange={handlePrimaryDeptSelect}
                placeholder="학과를 선택하세요"
                searchPlaceholder="학과명을 검색하세요"
                emptyMessage="검색 결과가 없습니다. 다른 학과 이름으로 검색해주세요."
                filterOption={matchOptionKeyword}
              />
            </Flex>
          )}

          {/* 복수전공 학과 검색 (조건부 렌더링) */}
          {majorType === 'DOUBLE' && (
            <Flex direction="flex-col" gap="gap-2">
              <Label required>복수전공 학과</Label>
              <SearchableSelect
                className="w-full"
                options={departmentOptions}
                value={doubleMajorCode}
                onChange={handleDoubleMajorSelect}
                placeholder="학과를 선택하세요"
                searchPlaceholder="학과명을 검색하세요"
                emptyMessage="검색 결과가 없습니다. 다른 학과 이름으로 검색해주세요."
                filterOption={matchOptionKeyword}
              />
            </Flex>
          )}
        </Flex>

        <Flex justify="justify-end" className="mt-4 w-full">
          <Button onClick={prevStep} variant="secondary" size="small">
            이전 단계
          </Button>
          <Button variant="primary" size="medium" onClick={handleNextStep} disabled={!isFormValid || isPending}>
            {isPending ? '저장 중...' : '다음 단계'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default BasicInfoForm;
