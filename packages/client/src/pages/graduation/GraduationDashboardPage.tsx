import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Flex, Banner, Button, Heading, SupportingText } from '@allcll/allcll-ui';
import {
  CategoryEarnedCoursesModal,
  CategoryProgressCard,
  CertificationSection,
  EarnedCoursesSection,
  OverallSummaryCard,
  RecommendedCoursesModal,
  SCOPE_TYPE_LABELS,
  filterCategories,
  filterCategoriesByScope,
  getScopeTypes,
  GENERAL_CATEGORY_TYPES,
  MAJOR_CATEGORY_TYPES,
  type BalanceRequiredArea,
  type CategoryType,
  type CriteriaCategory,
  type ScopeType,
} from '@allcll/common';
import useMobile from '@/shared/lib/useMobile';
import {
  graduationQueryKeys,
  useCertificationCriteria,
  useCriteriaCategories,
  useGraduationCourses,
} from '@/entities/graduation/model/useGraduation';
import LogoutButton from '@/features/user/ui/LogoutButton';
import { useGraduationDashboard } from '@/features/graduation/model/useGraduationDashboard';
import { useGraduationConfetti } from '@/features/graduation/lib/useGraduationConfetti';
import useFeedbackTrigger from '@/features/feedback/lib/FeedbackTrigger';
import FeedbackModal from '@/features/feedback/ui/FeedbackModal';
import MobileTabs, { useMobileTabs } from '@/features/graduation/ui/dashboard/MobileTabs';
import EditProfileModal from '@/features/graduation/ui/dashboard/EditProfileModal';
import CertificationEditModal from '@/features/graduation/ui/dashboard/CertificationEditModal';
import { useUpdateEnglishCertMutation } from '@/features/graduation/lib/useUpdateEnglishCertMutation';
import LoadingWithMessage from '@/shared/ui/Loading';

//TODO: API 연동 시간 측정 후, spinner로 변경 혹은 네트워크 지연 시간에 따른 스피너 타입 결정 훅 구현
function LoadingState() {
  return (
    <Flex justify="justify-center" align="items-center" className="min-h-[50vh]">
      <LoadingWithMessage message="졸업 요건 분석결과를 가져오는 중입니다." />
    </Flex>
  );
}

function GraduationDashboardPage() {
  const isMobile = useMobile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEnglishCertEditOpen, setIsEnglishCertEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryType: CategoryType;
    criteriaCategory?: CriteriaCategory;
    earnedAreas?: BalanceRequiredArea[];
  } | null>(null);
  const [selectedEarnedCategory, setSelectedEarnedCategory] = useState<{
    categoryType: CategoryType;
    majorScope: ScopeType;
  } | null>(null);
  const { activeTab, setActiveTab } = useMobileTabs('major');
  const { user, graduationData, analyzedAt, isPending, isError, error } = useGraduationDashboard();
  const { data: criteriaCategories } = useCriteriaCategories();
  const { data: graduationCourses } = useGraduationCourses();
  const {
    data: certificationCriteria,
    isPending: isCriteriaLoading,
    isError: isCriteriaError,
  } = useCertificationCriteria(true);
  const { mutate: updateEnglishCert, isPending: isUpdatingEnglishCert } = useUpdateEnglishCertMutation();
  const {
    isOpen: isFeedbackOpen,
    openMode: feedbackOpenMode,
    onClose: closeFeedback,
    open: openFeedback,
  } = useFeedbackTrigger({
    enabled: !isPending && !isError,
    isMobile,
    activeTab,
  });

  useGraduationConfetti(graduationData?.isGraduatable ?? false);

  const handleStartOverGraduationCheck = () => {
    if (!window.confirm('졸업 요건을 다시 검사하시겠습니까?')) return;
    navigate('/graduation?retry=true&skipInfo=true');
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleConfirmEnglishCertEdit = () => {
    if (!graduationData) return;
    updateEnglishCert(!graduationData.certifications.english.isPassed, {
      onSuccess: () => setIsEnglishCertEditOpen(false),
    });
  };

  const handleDeleteBanner = () => {
    setShowBanner(false);
  };

  const handleViewCourses = (
    categoryType: CategoryType,
    criteriaCategory?: CriteriaCategory,
    earnedAreas?: BalanceRequiredArea[],
  ) => {
    setSelectedCategory({ categoryType, criteriaCategory, earnedAreas });
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  const handleViewEarnedCourses = (categoryType: CategoryType, majorScope: ScopeType) => {
    setSelectedEarnedCategory({ categoryType, majorScope });
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

  const scopeTypes = getScopeTypes(user.majorType);
  const isSingleMajor = user.majorType === 'SINGLE';
  const courses = graduationCourses?.courses ?? [];

  const getCriteriaCategory = (categoryType: CategoryType, majorScope: ScopeType) => {
    return criteriaCategories?.categories.find(c => c.categoryType === categoryType && c.majorScope === majorScope);
  };

  const renderCategoryCards = (cats: typeof majorCategories) => (
    <Flex direction="flex-col" gap="gap-4" className="md:flex-row">
      {cats.map(category => (
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
  );

  const renderMobileCategoryCards = (cats: typeof majorCategories) => (
    <Flex direction="flex-col" gap="gap-4">
      {cats.map(category => (
        <CategoryProgressCard
          key={`${category.majorScope}-${category.categoryType}`}
          category={category}
          criteriaCategory={getCriteriaCategory(category.categoryType, category.majorScope)}
          onViewCourses={handleViewCourses}
          onViewEarnedCourses={handleViewEarnedCourses}
        />
      ))}
    </Flex>
  );

  const renderMobileContent = () => {
    switch (activeTab) {
      case 'major':
        return isSingleMajor ? (
          <section>
            <Heading level={2} className="mb-4">
              전공 이수 현황
            </Heading>
            {renderMobileCategoryCards(majorCategories)}
          </section>
        ) : (
          <Flex direction="flex-col" gap="gap-6">
            {scopeTypes.map(scope => (
              <section key={scope}>
                <Heading level={2} className="mb-4">
                  {SCOPE_TYPE_LABELS[scope]} 이수 현황
                </Heading>
                {renderMobileCategoryCards(
                  filterCategoriesByScope(graduationData.categories, scope, MAJOR_CATEGORY_TYPES),
                )}
              </section>
            ))}
          </Flex>
        );
      case 'general':
        return (
          <section>
            <Heading level={2} className="mb-4">
              교양 이수 현황
            </Heading>
            {renderMobileCategoryCards(generalCategories)}
          </section>
        );
      case 'certification':
        return certificationCriteria ? (
          <CertificationSection
            certifications={graduationData.certifications}
            criteriaData={certificationCriteria}
            onEditEnglishCert={() => setIsEnglishCertEditOpen(true)}
          />
        ) : null;
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

      {showBanner && (
        <Banner deleteBanner={handleDeleteBanner}>
          본 서비스는 베타 버전으로, 분석 결과는 공식적인 효력을 갖지 않습니다. 오류 또는 개선 사항이 있으시면
          알려주시면 서비스 개선에 도움이 됩니다.{' '}
          <button className="text-blue-700 font-semibold underline" onClick={() => openFeedback('manual')}>
            오류 제보
          </button>
        </Banner>
      )}

      <div className="max-w-5xl mx-auto mt-2 px-4">
        <Flex justify="justify-between" align="items-center">
          <Heading level={1}>졸업요건 분석</Heading>
          <Flex gap="gap-2">
            <Button variant="text" size="small" onClick={handleEditProfile}>
              회원 정보 수정
            </Button>
            <LogoutButton
              size="small"
              onSuccess={() => {
                queryClient.removeQueries({ queryKey: graduationQueryKeys.all });
                navigate('/graduation');
              }}
            />
          </Flex>
        </Flex>
        <SupportingText>{user.name}님의 졸업요건 분석 결과입니다.</SupportingText>

        <Flex direction="flex-col" gap="gap-2" className="mb-4 mt-2">
          <OverallSummaryCard user={user} checkData={graduationData} />

          <EarnedCoursesSection courses={courses} />

          <Flex justify="justify-between" align="items-center">
            <div></div>

            <Flex justify="justify-end" align="items-center" gap="gap-2">
              {analyzedAt && (
                <span className="text-sm text-gray-400">
                  {new Date(analyzedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  분석
                </span>
              )}
              <div className="bg-white rounded-md">
                <Button variant="outlined" size="medium" onClick={handleStartOverGraduationCheck}>
                  다시 검사하기
                </Button>
              </div>
            </Flex>
          </Flex>

          {isMobile ? (
            <>
              <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
              {renderMobileContent()}
            </>
          ) : (
            <Flex direction="flex-col" gap="gap-4">
              {isSingleMajor ? (
                <section>
                  <Heading level={2} className="mb-2">
                    전공 이수 현황
                  </Heading>
                  {renderCategoryCards(majorCategories)}
                </section>
              ) : (
                scopeTypes.map(scope => (
                  <section key={scope}>
                    <Heading level={2} className="mb-2">
                      {SCOPE_TYPE_LABELS[scope]} 이수 현황
                    </Heading>
                    {renderCategoryCards(
                      filterCategoriesByScope(graduationData.categories, scope, MAJOR_CATEGORY_TYPES),
                    )}
                  </section>
                ))
              )}

              <section>
                <Heading level={2} className="mb-2">
                  교양 이수 현황
                </Heading>
                {renderCategoryCards(generalCategories)}
              </section>

              {certificationCriteria && (
                <CertificationSection
                  certifications={graduationData.certifications}
                  criteriaData={certificationCriteria}
                  onEditEnglishCert={() => setIsEnglishCertEditOpen(true)}
                />
              )}
            </Flex>
          )}
        </Flex>
      </div>

      {selectedCategory && (
        <RecommendedCoursesModal
          isOpen
          onClose={handleCloseModal}
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
          courses={courses}
        />
      )}

      {user && <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} />}

      {isEnglishCertEditOpen && (
        <CertificationEditModal
          isOpen
          currentIsPassed={graduationData.certifications.english.isPassed}
          isPending={isUpdatingEnglishCert}
          criteriaData={certificationCriteria}
          isCriteriaLoading={isCriteriaLoading}
          isCriteriaError={isCriteriaError}
          onClose={() => setIsEnglishCertEditOpen(false)}
          onConfirm={handleConfirmEnglishCertEdit}
        />
      )}

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={closeFeedback}
        category="GRADUATION"
        openMode={feedbackOpenMode}
      />
    </>
  );
}

export default GraduationDashboardPage;
