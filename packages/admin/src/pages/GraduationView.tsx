import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Banner, Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import { useAdminGraduationView } from '@/hooks/server/graduation/useAdminGraduationView';
import PageHeader from '@/components/common/PageHeader';
import ChevronLeftIcon from '@/assets/chevron-left.svg?react';
import OverallSummaryCard from '@/components/graduation/OverallSummaryCard';
import CategoryProgressCard from '@/components/graduation/CategoryProgressCard';
import CertificationSection from '@/components/graduation/CertificationSection';
import EarnedCoursesSection from '@/components/graduation/EarnedCoursesSection';
import { CATEGORY_TYPE_LABELS, SCOPE_TYPE_LABELS } from '@/components/graduation/lib/mappers';
import { MAJOR_CATEGORY_TYPES, GENERAL_CATEGORY_TYPES } from '@/components/graduation/lib/rules';

function GraduationView() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError } = useAdminGraduationView(studentId ?? '');
  const [showBanner, setShowBanner] = useState(true);

  if (isPending) {
    return (
      <Flex justify="justify-center" align="items-center" className="min-h-[50vh]">
        <SupportingText>졸업 요건 분석결과를 가져오는 중입니다.</SupportingText>
      </Flex>
    );
  }

  if (isError || !data) {
    return (
      <Flex direction="flex-col" justify="justify-center" align="items-center" gap="gap-3" className="min-h-[50vh]">
        <SupportingText>졸업요건 데이터를 불러올 수 없습니다.</SupportingText>
        <Button variant="outlined" size="small" onClick={() => navigate('/reviews')}>
          후기 목록으로 돌아가기
        </Button>
      </Flex>
    );
  }

  const { user, checkData, courses, certificationCriteria } = data;
  const { categories, certifications } = checkData;

  const majorCategories = categories.filter(c => (MAJOR_CATEGORY_TYPES as readonly string[]).includes(c.categoryType));
  const generalCategories = categories.filter(c =>
    (GENERAL_CATEGORY_TYPES as readonly string[]).includes(c.categoryType),
  );

  const isSingleMajor = user.majorType === 'SINGLE';
  const scopeTypes = isSingleMajor ? (['PRIMARY'] as const) : (['PRIMARY', 'SECONDARY'] as const);

  const analyzedAt = courses.createdAt
    ? new Date(courses.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="flex flex-col gap-5">
      {showBanner && (
        <Banner variant="info" deleteBanner={() => setShowBanner(false)}>
          어드민 열람 모드 — {user.name}({user.studentId})님의 졸업요건 데이터를 보고 있습니다.
        </Banner>
      )}

      <Flex align="items-center" gap="gap-3">
        <Button variant="outlined" size="small" onClick={() => navigate('/reviews')}>
          <ChevronLeftIcon className="w-4 h-4" />
          후기 목록
        </Button>
        <PageHeader title="졸업요건 분석" description={`${user.name}님의 졸업요건 분석 결과입니다.`} />
      </Flex>

      <main className="flex flex-col gap-5">
        <OverallSummaryCard user={user} checkData={checkData} />

        <EarnedCoursesSection courses={courses.courses} />

        {analyzedAt && (
          <Flex justify="justify-end">
            <span className="text-sm text-gray-400">{analyzedAt} 분석</span>
          </Flex>
        )}

        {isSingleMajor ? (
          <section>
            <Heading level={2} className="mb-2">
              전공 이수 현황
            </Heading>
            <div className="flex flex-col md:flex-row gap-4">
              {majorCategories.map(category => (
                <div className="flex-1" key={category.categoryType}>
                  <CategoryProgressCard
                    category={category}
                    label={CATEGORY_TYPE_LABELS[category.categoryType] ?? category.categoryType}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          scopeTypes.map(scope => {
            const scopeCategories = majorCategories.filter(c => c.majorScope === scope);
            return (
              <section key={scope}>
                <Heading level={2} className="mb-2">
                  {SCOPE_TYPE_LABELS[scope]} 이수 현황
                </Heading>
                <div className="flex flex-col md:flex-row gap-4">
                  {scopeCategories.map(category => (
                    <div className="flex-1" key={`${category.majorScope}-${category.categoryType}`}>
                      <CategoryProgressCard
                        category={category}
                        label={CATEGORY_TYPE_LABELS[category.categoryType] ?? category.categoryType}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}

        <section>
          <Heading level={2} className="mb-2">
            교양 이수 현황
          </Heading>
          <div className="flex flex-col md:flex-row gap-4">
            {generalCategories.map(category => (
              <div className="flex-1" key={category.categoryType}>
                <CategoryProgressCard
                  category={category}
                  label={CATEGORY_TYPE_LABELS[category.categoryType] ?? category.categoryType}
                />
              </div>
            ))}
          </div>
        </section>

        <CertificationSection certifications={certifications} criteriaData={certificationCriteria} />
      </main>
    </div>
  );
}

export default GraduationView;
