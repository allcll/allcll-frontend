import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import {
  CategoryEarnedCoursesModal,
  CategoryProgressCard,
  CertificationSection,
  EarnedCoursesSection,
  GENERAL_CATEGORY_TYPES,
  MAJOR_CATEGORY_TYPES,
  OverallSummaryCard,
  RecommendedCoursesModal,
  SCOPE_TYPE_LABELS,
  filterCategories,
  filterCategoriesByScope,
  getScopeTypes,
  type BalanceRequiredArea,
  type CategoryType,
  type CriteriaCategory,
  type ScopeType,
} from '@allcll/common';
import { useAdminGraduationView } from '@/hooks/server/graduation/useAdminGraduationView';
import PageHeader from '@/components/common/PageHeader';
import ChevronLeftIcon from '@/assets/chevron-left.svg?react';

function GraduationView() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError } = useAdminGraduationView(studentId ?? '');
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryType: CategoryType;
    criteriaCategory?: CriteriaCategory;
    earnedAreas?: BalanceRequiredArea[];
  } | null>(null);
  const [selectedEarnedCategory, setSelectedEarnedCategory] = useState<{
    categoryType: CategoryType;
    majorScope: ScopeType;
  } | null>(null);

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

  const majorCategories = filterCategories(categories, MAJOR_CATEGORY_TYPES);
  const generalCategories = filterCategories(categories, GENERAL_CATEGORY_TYPES);

  const isSingleMajor = user.majorType === 'SINGLE';
  const scopeTypes = getScopeTypes(user.majorType);

  const analyzedAt = courses.createdAt
    ? new Date(courses.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const getCriteriaCategory = (categoryType: CategoryType, majorScope: ScopeType) =>
    data.criteriaCategories.categories.find(c => c.categoryType === categoryType && c.majorScope === majorScope);

  const handleViewCourses = (
    categoryType: CategoryType,
    criteriaCategory?: CriteriaCategory,
    earnedAreas?: BalanceRequiredArea[],
  ) => {
    setSelectedCategory({ categoryType, criteriaCategory, earnedAreas });
  };

  const handleViewEarnedCourses = (categoryType: CategoryType, majorScope: ScopeType) => {
    setSelectedEarnedCategory({ categoryType, majorScope });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-fit">
        <Button variant="outlined" size="small" onClick={() => navigate('/reviews')}>
          <ChevronLeftIcon className="w-4 h-4" />
          후기 목록
        </Button>
      </div>

      <PageHeader
        title="졸업요건 분석"
        description={`${user.name}(${user.studentId})님의 졸업요건 데이터를 보고 있습니다.`}
      />

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
            <Flex direction="flex-col" gap="gap-4" className="md:flex-row">
              {majorCategories.map(category => (
                <div className="flex-1" key={category.categoryType}>
                  <CategoryProgressCard
                    category={category}
                    criteriaCategory={getCriteriaCategory(category.categoryType, category.majorScope)}
                    onViewCourses={handleViewCourses}
                    onViewEarnedCourses={handleViewEarnedCourses}
                  />
                </div>
              ))}
            </Flex>
          </section>
        ) : (
          scopeTypes.map(scope => {
            const scopeCategories = filterCategoriesByScope(categories, scope, MAJOR_CATEGORY_TYPES);
            return (
              <section key={scope}>
                <Heading level={2} className="mb-2">
                  {SCOPE_TYPE_LABELS[scope]} 이수 현황
                </Heading>
                <Flex direction="flex-col" gap="gap-4" className="md:flex-row">
                  {scopeCategories.map(category => (
                    <div className="flex-1" key={`${category.majorScope}-${category.categoryType}`}>
                      <CategoryProgressCard
                        category={category}
                        criteriaCategory={getCriteriaCategory(category.categoryType, category.majorScope)}
                        onViewCourses={handleViewCourses}
                        onViewEarnedCourses={handleViewEarnedCourses}
                      />
                    </div>
                  ))}
                </Flex>
              </section>
            );
          })
        )}

        <section>
          <Heading level={2} className="mb-2">
            교양 이수 현황
          </Heading>
          <Flex direction="flex-col" gap="gap-4" className="md:flex-row">
            {generalCategories.map(category => (
              <div className="flex-1" key={category.categoryType}>
                <CategoryProgressCard
                  category={category}
                  criteriaCategory={getCriteriaCategory(category.categoryType, category.majorScope)}
                  onViewCourses={handleViewCourses}
                  onViewEarnedCourses={handleViewEarnedCourses}
                />
              </div>
            ))}
          </Flex>
        </section>

        <CertificationSection certifications={certifications} criteriaData={certificationCriteria} />
      </main>

      {selectedCategory && (
        <RecommendedCoursesModal
          isOpen
          onClose={() => setSelectedCategory(null)}
          categoryType={selectedCategory.categoryType}
          criteriaCategory={selectedCategory.criteriaCategory}
          earnedAreas={selectedCategory.earnedAreas}
        />
      )}

      {selectedEarnedCategory && (
        <CategoryEarnedCoursesModal
          isOpen
          onClose={() => setSelectedEarnedCategory(null)}
          categoryType={selectedEarnedCategory.categoryType}
          majorScope={selectedEarnedCategory.majorScope}
          courses={courses.courses}
        />
      )}
    </div>
  );
}

export default GraduationView;
