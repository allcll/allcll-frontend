import { useState } from 'react';
import { Card, Flex, Heading, SupportingText, Label, Chip, Button, ListboxOption, Grid } from '@allcll/allcll-ui';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { useFilteringDepartment } from '@/features/filtering/lib/useFilteringDepartment.ts';
import CheckSvg from '@/assets/checkbox-blue.svg?react';
import { ZeroContent } from '@/shared/ui/ZeroContent';
import { JolupStepsProps } from '@/features/jolup/model/types.ts';

type MajorType = 'INTENSIVE' | 'DOUBLE'; // 심화전공 | 복수전공

const BasicInfoForm = ({ nextStep, prevStep }: JolupStepsProps) => {
  const [majorType, setMajorType] = useState<MajorType>('INTENSIVE');
  const [doubleMajorCode, setDoubleMajorCode] = useState<string>('');
  const [, setDoubleMajorName] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState('');

  const { data: departments } = useDepartments();
  const { filteredDepartments } = useFilteringDepartment({
    category: '전공',
    searchKeywords,
    departments,
  });

  const handleMajorTypeChange = (type: MajorType) => {
    setMajorType(type);
    if (type === 'INTENSIVE') {
      setDoubleMajorCode('');
      setDoubleMajorName('');
    }
  };

  const handleDoubleMajorSelect = (departmentCode: string, departmentName: string) => {
    setDoubleMajorCode(departmentCode);
    setDoubleMajorName(departmentName);
    setSearchKeywords(departmentName);
    setIsSearchOpen(false);
  };

  const isFormValid = majorType === 'INTENSIVE' || (majorType === 'DOUBLE' && doubleMajorCode !== '');

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
                selected={majorType === 'INTENSIVE'}
                onClick={() => handleMajorTypeChange('INTENSIVE')}
              />
              <Chip
                label="복수전공"
                selected={majorType === 'DOUBLE'}
                onClick={() => handleMajorTypeChange('DOUBLE')}
              />
            </Grid>
          </Flex>

          {/* 복수전공 학과 검색 (조건부 렌더링) */}
          {majorType === 'DOUBLE' && (
            <Flex direction="flex-col" gap="gap-2">
              <Label required>복수전공 학과</Label>
              <div className="relative">
                <SearchBox
                  placeholder="학과명을 검색하세요"
                  value={searchKeywords}
                  onChange={e => {
                    setSearchKeywords(e.target.value);
                    setIsSearchOpen(true);
                    if (doubleMajorCode) {
                      setDoubleMajorCode(''); // 검색어 변경 시 선택 초기화
                    }
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onDelete={() => {
                    setSearchKeywords('');
                    setDoubleMajorCode('');
                    setDoubleMajorName('');
                    setIsSearchOpen(false);
                  }}
                  className="w-full"
                />

                {isSearchOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredDepartments && filteredDepartments.length > 0 ? (
                      filteredDepartments.map(department => {
                        const departmentName = department.departmentName
                          ? department.departmentName.split(' ').slice(-1)[0]
                          : '학과 정보 없음';
                        const isSelected = doubleMajorCode === department.departmentCode;

                        return (
                          <ListboxOption
                            key={department.departmentCode}
                            selected={isSelected}
                            left={<span>{departmentName}</span>}
                            right={isSelected ? <CheckSvg className="w-4 h-4 shrink-0" /> : null}
                            onSelect={() => handleDoubleMajorSelect(department.departmentCode, departmentName)}
                          />
                        );
                      })
                    ) : (
                      <div className="p-4">
                        <ZeroContent title="검색 결과가 없습니다." description="다른 학과 이름으로 검색해주세요." />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Flex>
          )}
        </Flex>

        <Flex justify="justify-end" className="mt-4 w-full">
          <Button onClick={prevStep} variant="secondary" size="small">
            이전 단계
          </Button>
          <Button variant="primary" size="medium" onClick={nextStep} disabled={!isFormValid}>
            다음 단계
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default BasicInfoForm;
