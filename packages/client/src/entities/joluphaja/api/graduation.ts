import { fetchJsonOnAPI } from '@/shared/api/api';

/** 사용자 정보 응답 */
export interface UserInfo {
  userId: number;
  studentId: string;
  studentName: string;
  deptName: string;
  deptCd: string;
  majorType: 'SINGLE' | 'DOUBLE' | 'MINOR';
}

/** 학점 요약 정보 */
export interface CreditSummary {
  totalCredits: number;
  requiredTotalCredits: number;
  remainingCredits: number;
}

/** 카테고리 타입 */
export type CategoryType =
  | 'COMMON_REQUIRED'
  | 'BALANCE_REQUIRED'
  | 'ACADEMIC_BASIC'
  | 'GENERAL_ELECTIVE'
  | 'MAJOR_REQUIRED'
  | 'MAJOR_ELECTIVE'
  | 'MAJOR_TOTAL';

/** 스코프 타입 */
export type ScopeType = 'PRIMARY' | 'SECONDARY';

/** 카테고리별 이수 현황 */
export interface CategoryProgress {
  scope: ScopeType;
  categoryType: CategoryType;
  earnedCredits: number;
  requiredCredits: number;
  remainingCredits: number;
  satisfied: boolean;
}

/** 미이수 과목 정보 */
export interface MissingCourse {
  curiNo: string;
  curiNm: string;
}

/** 필수 과목 추천 */
export interface RequiredCourseRecommendation {
  scope: ScopeType;
  categoryType: CategoryType;
  missingCourses: MissingCourse[];
}

/** 추천 정보 */
export interface Recommendations {
  requiredCourses: RequiredCourseRecommendation[];
}

/** 졸업인증 정책 타입 */
export type CertificationRuleType = 'LEGACY_ALL' | 'ANY_TWO_OF_THREE';

/** 졸업인증 정책 */
export interface CertificationPolicy {
  ruleType: CertificationRuleType;
  requiredPassCount: number;
}

/** 인증 대상 타입 */
export type CertificationTargetType = 'MAJOR' | 'NON_MAJOR';

/** 영어 인증 */
export interface EnglishCertification {
  passed: boolean;
  targetType: CertificationTargetType;
}

/** 코딩 인증 */
export interface CodingCertification {
  passed: boolean;
  targetType: CertificationTargetType;
}

/** 고전독서 도메인 타입 */
export type ClassicDomainType =
  | 'WESTERN_HISTORY_THOUGHT'
  | 'EASTERN_HISTORY_THOUGHT'
  | 'EAST_WEST_LITERATURE'
  | 'SCIENCE_THOUGHT';

/** 고전독서 도메인별 현황 */
export interface ClassicDomain {
  domainType: ClassicDomainType;
  requiredCount: number;
  myCount: number;
  satisfied: boolean;
}

/** 고전독서 인증 */
export interface ClassicCertification {
  passed: boolean;
  total: {
    requiredCount: number;
    myCount: number;
  };
  domains: ClassicDomain[];
}

/** 졸업인증 정보 */
export interface Certifications {
  policy: CertificationPolicy;
  passedCount: number;
  requiredPassCount: number;
  isSatisfied: boolean;
  english: EnglishCertification;
  coding: CodingCertification;
  classic: ClassicCertification;
}

/** 졸업요건 검사 데이터 */
export interface GraduationCheckData {
  checkId: number;
  createdAt: string;
  isGraduatable: boolean;
  summary: CreditSummary;
  categories: CategoryProgress[];
  recommendations: Recommendations;
  certifications: Certifications;
}

/** 졸업요건 검사 API 응답 */
export interface GraduationCheckResponse {
  data: GraduationCheckData;
}

/** 카테고리 그룹 (전공/교양 구분용) */
export type CategoryGroup = 'major' | 'general';

/** 학번 기반 정책 연도 */
export type PolicyYear = 'before22' | 'from22' | 'from23';

export async function fetchUserInfo(): Promise<UserInfo> {
  return await fetchJsonOnAPI<UserInfo>('/api/auth/me');
}

export async function fetchGraduationCheck(): Promise<GraduationCheckResponse> {
  return await fetchJsonOnAPI<GraduationCheckResponse>('/api/graduation/check');
}
