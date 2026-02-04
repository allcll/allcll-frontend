import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Flex, Banner, Button } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile';
import { useGraduationDashboard } from '@/entities/joluphaja/model/useGraduation';
import {
  getPolicyYear,
  getGeneralCategoryTypes,
  filterCategories,
  MAJOR_CATEGORY_TYPES,
  getScopeTypes,
  filterCategoriesByScope,
  SCOPE_TYPE_LABELS,
} from '@/features/joluphaja/lib/mappers';
import type { CategoryType } from '@/entities/joluphaja/api/graduation';
import OverallSummaryCard from '@/features/joluphaja/ui/OverallSummaryCard';
import CategoryProgressCard from '@/features/joluphaja/ui/CategoryProgressCard';
import CertificationSection from '@/features/joluphaja/ui/CertificationSection';
import MobileTabs, { useMobileTabs } from '@/features/joluphaja/ui/MobileTabs';

function LoadingState() {
  return (
    // TODO: 로딩 스피너 추가
    <Flex justify="justify-center" align="items-center" className="min-h-[400px]">
      <div className="text-gray-500">졸업요건을 분석하고 있습니다...</div>
    </Flex>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Flex justify="justify-center" align="items-center" className="min-h-[400px]">
      <div className="text-center">
        <p className="text-secondary-500 font-semibold mb-2">오류가 발생했습니다</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </Flex>
  );
}

function GraduationDashboardPage() {
  const isMobile = useMobile();
  const [showBanner, setShowBanner] = useState(true);
  const { activeTab, setActiveTab } = useMobileTabs('major');
  const { userInfo, graduationData, isPending, isError, error, refetch } = useGraduationDashboard();

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteBanner = () => {
    setShowBanner(false);
  };

  const handleViewCourses = (categoryType: CategoryType) => {
    // TODO: 미이수 과목 추천 모달 열기
    console.log('과목 확인 클릭:', categoryType);
  };

  if (isPending) {
    return (
      <>
        <Helmet>
          <title>ALLCLL | 졸업요건 분석</title>
        </Helmet>
        <LoadingState />
      </>
    );
  }

  if (isError || !userInfo || !graduationData) {
    return (
      <>
        <Helmet>
          <title>ALLCLL | 졸업요건 분석</title>
        </Helmet>
        <ErrorState message={error?.message || '데이터를 불러올 수 없습니다.'} />
      </>
    );
  }

  const policyYear = getPolicyYear(userInfo.studentId);
  const generalCategoryTypes = getGeneralCategoryTypes(policyYear);
  const majorCategories = filterCategories(graduationData.categories, MAJOR_CATEGORY_TYPES);
  const generalCategories = filterCategories(graduationData.categories, generalCategoryTypes);

  // 전공 타입에 따른 스코프 목록
  const scopeTypes = getScopeTypes(userInfo.majorType);
  const isSingleMajor = userInfo.majorType === 'SINGLE';

  // 추천 과목 매핑 (categoryType별 미이수 과목)
  const getMissingCourses = (categoryType: CategoryType) => {
    const recommendation = graduationData.recommendations.requiredCourses.find(r => r.categoryType === categoryType);
    return recommendation?.missingCourses;
  };

  // 모바일 탭별 컨텐츠 렌더링
  const renderMobileContent = () => {
    switch (activeTab) {
      case 'major':
        return isSingleMajor ? (
          // 단일 전공
          <section>
            <h2 className="text-xl font-bold mb-4">전공 이수 현황</h2>
            <Flex direction="flex-col" gap="gap-4">
              {majorCategories.map(category => (
                <CategoryProgressCard
                  key={category.categoryType}
                  category={category}
                  missingCourses={getMissingCourses(category.categoryType)}
                  onViewCourses={handleViewCourses}
                />
              ))}
            </Flex>
          </section>
        ) : (
          // 복수전공/부전공
          <Flex direction="flex-col" gap="gap-6">
            {scopeTypes.map(scope => {
              const scopeCategories = filterCategoriesByScope(graduationData.categories, scope, MAJOR_CATEGORY_TYPES);
              const scopeLabel = SCOPE_TYPE_LABELS[scope];

              return (
                <section key={scope}>
                  <h2 className="text-xl font-bold mb-4">{scopeLabel} 이수 현황</h2>
                  <Flex direction="flex-col" gap="gap-4">
                    {scopeCategories.map(category => (
                      <CategoryProgressCard
                        key={`${category.scope}-${category.categoryType}`}
                        category={category}
                        missingCourses={getMissingCourses(category.categoryType)}
                        onViewCourses={handleViewCourses}
                      />
                    ))}
                  </Flex>
                </section>
              );
            })}
          </Flex>
        );
      case 'general':
        return (
          <section>
            <h2 className="text-xl font-bold mb-4">교양 이수 현황</h2>
            <Flex direction="flex-col" gap="gap-4">
              {generalCategories.map(category => (
                <CategoryProgressCard
                  key={category.categoryType}
                  category={category}
                  missingCourses={getMissingCourses(category.categoryType)}
                  onViewCourses={handleViewCourses}
                />
              ))}
            </Flex>
          </section>
        );
      case 'certification':
        return <CertificationSection certifications={graduationData.certifications} policyYear={policyYear} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ALLCLL | 졸업요건 분석</title>
        <meta name="description" content="졸업요건 분석 결과를 확인하세요." />
      </Helmet>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 안내 배너 */}
        {showBanner && (
          <div className="mb-6">
            <Banner deleteBanner={handleDeleteBanner}>
              본 결과는 공식적인 효력을 갖지 않습니다. 최종 졸업 확정 여부는 학과 사무실을 통해 확인하시기 바랍니다.
            </Banner>
          </div>
        )}

        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold mb-2">졸업요건 분석</h1>
        <p className="text-gray-500 mb-6">{userInfo.studentName}님의 졸업요건 분석 결과입니다.</p>

        {/* 전체 진행률 카드 */}
        <OverallSummaryCard userInfo={userInfo} graduationData={graduationData} />

        {/* 다시 검사하기 버튼 */}
        <Flex justify="justify-end" className="mt-4 mb-8">
          <div className="bg-white rounded-md">
            <Button variant="outlined" size="medium" onClick={handleRefresh}>
              다시 검사하기
            </Button>
          </div>
        </Flex>

        {/* 모바일: 탭 UI */}
        {isMobile ? (
          <>
            <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderMobileContent()}
          </>
        ) : (
          <>
            {/* 웹: 전공 이수 현황 */}
            {isSingleMajor ? (
              // 단일 전공
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">전공 이수 현황</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {majorCategories.map(category => (
                    <CategoryProgressCard
                      key={category.categoryType}
                      category={category}
                      missingCourses={getMissingCourses(category.categoryType)}
                      onViewCourses={handleViewCourses}
                    />
                  ))}
                </div>
              </section>
            ) : (
              // 복수전공/부전공
              <>
                {scopeTypes.map(scope => {
                  const scopeCategories = filterCategoriesByScope(
                    graduationData.categories,
                    scope,
                    MAJOR_CATEGORY_TYPES,
                  );
                  const scopeLabel = SCOPE_TYPE_LABELS[scope];

                  return (
                    <section key={scope} className="mb-10">
                      <h2 className="text-xl font-bold mb-4">{scopeLabel} 이수 현황</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scopeCategories.map(category => (
                          <CategoryProgressCard
                            key={`${category.scope}-${category.categoryType}`}
                            category={category}
                            missingCourses={getMissingCourses(category.categoryType)}
                            onViewCourses={handleViewCourses}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}

            {/* 웹: 교양 이수 현황 */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">교양 이수 현황</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generalCategories.map(category => (
                  <CategoryProgressCard
                    key={category.categoryType}
                    category={category}
                    missingCourses={getMissingCourses(category.categoryType)}
                    onViewCourses={handleViewCourses}
                  />
                ))}
              </div>
            </section>

            {/* 웹: 졸업인증 */}
            <CertificationSection certifications={graduationData.certifications} policyYear={policyYear} />
          </>
        )}
      </div>
    </>
  );
}

export default GraduationDashboardPage;
