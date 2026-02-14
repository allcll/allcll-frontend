import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Banner, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile';
import { graduationQueryKeys } from '@/entities/joluphaja/model/useGraduation';
import LogoutButton from '@/features/user/ui/LogoutButton';
import { useGraduationDashboard } from '@/features/joluphaja/model/useGraduationDashboard';
import { useCriteriaCategories } from '@/entities/joluphaja/model/useGraduation';
import {
  filterCategories,
  MAJOR_CATEGORY_TYPES,
  GENERAL_CATEGORY_TYPES,
  getScopeTypes,
  filterCategoriesByScope,
} from '@/entities/joluphaja/lib/rules';
import { SCOPE_TYPE_LABELS } from '@/features/joluphaja/lib/mappers';
import type { CategoryType, MissingCourse, ScopeType } from '@/entities/joluphaja/api/graduation';
import OverallSummaryCard from '@/entities/joluphaja/ui/OverallSummaryCard';
import CategoryProgressCard from '@/features/joluphaja/ui/CategoryProgressCard';
import CertificationSection from '@/features/joluphaja/ui/CertificationSection';
import MobileTabs, { useMobileTabs } from '@/features/joluphaja/ui/MobileTabs';
import RecommendedCoursesModal from '@/features/joluphaja/ui/RecommendedCoursesModal';
import EditProfileModal from '@/features/joluphaja/ui/EditProfileModal';
import Loading from '@/shared/ui/Loading';

function LoadingState() {
  return (
    <Flex justify="justify-center" align="items-center" className="min-h-[50vh]">
      <Loading message="졸업 요건을 분석하고 있습니다" />
    </Flex>
  );
}

function GraduationDashboardPage() {
  const isMobile = useMobile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryType: CategoryType;
    missingCourses: MissingCourse[];
  } | null>(null);
  const { activeTab, setActiveTab } = useMobileTabs('major');
  const { user, graduationData, isPending, isError, error } = useGraduationDashboard();
  const { data: criteriaCategories } = useCriteriaCategories();

  const handleStartOverGraduationCheck = () => {
    // todo 추후에 파일 추가 단계로 넘어가는 로직 추가
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleDeleteBanner = () => {
    setShowBanner(false);
  };

  const handleViewCourses = (categoryType: CategoryType, missingCourses: MissingCourse[]) => {
    setSelectedCategory({ categoryType, missingCourses });
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
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

  if (isError || !user || !graduationData) {
    throw error || new Error('졸업 요건 데이터를 불러올 수 없습니다.');
  }

  const majorCategories = filterCategories(graduationData.categories, MAJOR_CATEGORY_TYPES);
  const generalCategories = filterCategories(graduationData.categories, GENERAL_CATEGORY_TYPES);

  // 전공 타입에 따른 스코프 목록
  const scopeTypes = getScopeTypes(user.majorType);
  const isSingleMajor = user.majorType === 'SINGLE';

  // 추천 과목 매핑 (categoryType별 필수 과목)
  const getMissingCourses = (categoryType: CategoryType, majorScope: ScopeType) => {
    const category = criteriaCategories?.categories.find(
      c => c.categoryType === categoryType && c.majorScope === majorScope,
    );
    return category?.requiredCourses;
  };

  // 모바일 탭별 컨텐츠 렌더링
  const renderMobileContent = () => {
    switch (activeTab) {
      case 'major':
        return isSingleMajor ? (
          // 단일 전공
          <section>
            <Heading level={2} className="mb-4">
              전공 이수 현황
            </Heading>
            <Flex direction="flex-col" gap="gap-4">
              {majorCategories.map(category => (
                <CategoryProgressCard
                  key={category.categoryType}
                  category={category}
                  missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
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
                  <Heading level={2} className="mb-4">
                    {scopeLabel} 이수 현황
                  </Heading>
                  <Flex direction="flex-col" gap="gap-4">
                    {scopeCategories.map(category => (
                      <CategoryProgressCard
                        key={`${category.majorScope}-${category.categoryType}`}
                        category={category}
                        missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
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
            <Heading level={2} className="mb-4">
              교양 이수 현황
            </Heading>
            <Flex direction="flex-col" gap="gap-4">
              {generalCategories.map(category => (
                <CategoryProgressCard
                  key={category.categoryType}
                  category={category}
                  missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
                  onViewCourses={handleViewCourses}
                />
              ))}
            </Flex>
          </section>
        );
      case 'certification':
        return <CertificationSection certifications={graduationData.certifications} />;
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

      {/* 안내 배너 */}
      {showBanner && (
        <Banner deleteBanner={handleDeleteBanner}>
          본 결과는 공식적인 효력을 갖지 않습니다. 최종 졸업 확정 여부는 학과 사무실을 통해 확인하시기 바랍니다.
        </Banner>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 페이지 제목 */}
        <Flex justify="justify-between" align="items-center">
          <Heading level={1}>졸업요건 분석</Heading>
          <Flex gap="gap-2">
            <Button variant="text" size="small" onClick={handleEditProfile}>
              회원 정보 수정
            </Button>
            <LogoutButton
              variant="text"
              size="small"
              onSuccess={() => {
                queryClient.removeQueries({ queryKey: graduationQueryKeys.all });
                navigate('/graduation?retry=true');
              }}
            />
          </Flex>
        </Flex>
        <SupportingText className="mb-6">{user.name}님의 졸업요건 분석 결과입니다.</SupportingText>

        {/* 전체 진행률 카드 */}
        <OverallSummaryCard user={user} graduationData={graduationData} />

        {/* 다시 검사하기 버튼 */}
        <Flex justify="justify-end" className="mt-4 mb-8">
          <div className="bg-white rounded-md">
            <Button variant="outlined" size="medium" onClick={handleStartOverGraduationCheck} asChild>
              <Link to="/graduation?retry=true">다시 검사하기</Link>
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
                <Heading level={2} className="mb-4">
                  전공 이수 현황
                </Heading>
                <div className="flex flex-col md:flex-row gap-4">
                  {majorCategories.map(category => (
                    <div className="flex-1" key={category.categoryType}>
                      <CategoryProgressCard
                        category={category}
                        missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
                        onViewCourses={handleViewCourses}
                      />
                    </div>
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
                      <Heading level={2} className="mb-4">
                        {scopeLabel} 이수 현황
                      </Heading>
                      <div className="flex flex-col md:flex-row gap-4">
                        {scopeCategories.map(category => (
                          <div className="flex-1" key={`${category.majorScope}-${category.categoryType}`}>
                            <CategoryProgressCard
                              category={category}
                              missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
                              onViewCourses={handleViewCourses}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}

            {/* 웹: 교양 이수 현황 */}
            <section className="mb-10">
              <Heading level={2} className="mb-4">
                교양 이수 현황
              </Heading>
              <div className="flex flex-col md:flex-row gap-4">
                {generalCategories.map(category => (
                  <div className="flex-1" key={category.categoryType}>
                    <CategoryProgressCard
                      category={category}
                      missingCourses={getMissingCourses(category.categoryType, category.majorScope)}
                      onViewCourses={handleViewCourses}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 웹: 졸업인증 */}
            <CertificationSection certifications={graduationData.certifications} />
          </>
        )}
      </div>

      {/* 추천 과목 모달 */}
      {selectedCategory && (
        <RecommendedCoursesModal
          isOpen
          onClose={handleCloseModal}
          categoryType={selectedCategory.categoryType}
          missingCourses={selectedCategory.missingCourses}
        />
      )}

      {/* 회원 정보 수정 모달 */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
        />
      )}
    </>
  );
}

export default GraduationDashboardPage;
