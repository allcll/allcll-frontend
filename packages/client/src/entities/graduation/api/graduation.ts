import { fetchJsonOnAPI } from '@/shared/api/api';

/** 학점 요약 정보 */
export interface CreditSummary {
  totalMyCredits: number;
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
  | 'MAJOR_BASIC'
  | 'TOTAL_COMPLETION';

/** 스코프 타입 */
export type ScopeType = 'PRIMARY' | 'SECONDARY' | 'MINOR';

/** 카테고리별 이수 현황 */
export interface CategoryProgress {
  majorScope: ScopeType;
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

/** 졸업인증 정책 타입 */
export type CertificationRuleType = 'BOTH_REQUIRED' | 'TWO_OF_THREE';

/** 졸업인증 정책 */
export interface CertificationPolicy {
  ruleType: CertificationRuleType;
  requiredPassCount: number;
}

/** 인증 대상 타입 */
export type CertificationTargetType = 'MAJOR' | 'NON_MAJOR' | 'CODING_MAJOR';

/** 영어 인증 */
export interface EnglishCertification {
  isPassed: boolean;
  isRequired: boolean;
  targetType: CertificationTargetType;
}

/** 코딩 인증 */
export interface CodingCertification {
  isPassed: boolean;
  isRequired: boolean;
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
  isSatisfied: boolean;
}

/** 고전독서 인증 */
export interface ClassicCertification {
  isPassed: boolean;
  isRequired: boolean;
  totalRequiredCount: number;
  totalMyCount: number;
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
  certifications: Certifications;
}

/** 카테고리 그룹 (전공/교양 구분용) */
export type CategoryGroup = 'major' | 'general';

export async function fetchGraduationCheck(): Promise<GraduationCheckData> {
  return await fetchJsonOnAPI<GraduationCheckData>('/api/graduation/check');
}

// ---- 졸업인증 기준 조회 API ----

/** 영어 인증 대상 타입 */
export type EnglishTargetType = 'ENGLISH_MAJOR' | 'NON_MAJOR' | 'EXEMPT';

/** 코딩 인증 대상 타입 */
export type CodingTargetType = 'CODING_MAJOR' | 'NON_MAJOR' | 'EXEMPT';

/** 졸업인증 기준 - 대상 정보 */
export interface CriteriaTarget {
  englishTargetType: EnglishTargetType;
  codingTargetType: CodingTargetType;
}

/** 졸업인증 기준 - 정책 규칙 타입 */
export type GraduationCertRuleType = 'BOTH_REQUIRED' | 'TWO_OF_THREE';

/** 졸업인증 기준 - 정책 */
export interface CertPolicy {
  graduationCertRuleType: GraduationCertRuleType;
  requiredPassCount: number;
  enableEnglish: boolean;
  enableClassic: boolean;
  enableCoding: boolean;
}

/** 영어 인증 대체 과목 */
export interface EnglishAltCourse {
  altCuriNo: string;
  altCuriNm: string;
  altCuriCredit: number;
}

/** 영어 인증 기준 */
export interface EnglishCertCriteria {
  englishTargetType: EnglishTargetType;
  toeicMinScore: number;
  toeflIbtMinScore: number;
  tepsMinScore: number;
  newTepsMinScore: number;
  opicMinLevel: string;
  toeicSpeakingMinLevel: string;
  gtelpLevel: number;
  gtelpMinScore: number;
  gtelpSpeakingLevel: number;
  altCourse: EnglishAltCourse;
}

/** 고전독서 인증 기준 */
export interface ClassicCertCriteria {
  totalRequiredCount: number;
  requiredCountWestern: number;
  requiredCountEastern: number;
  requiredCountEasternAndWestern: number;
  requiredCountScience: number;
}

/** 코딩 인증 대체 과목 */
export interface CodingAltCourse {
  alt1CuriNo: string;
  alt1CuriNm: string;
  alt1MinGrade: string;
  alt2CuriNo: string | null;
  alt2CuriNm: string | null;
  alt2MinGrade: string | null;
}

/** 코딩 인증 기준 */
export interface CodingCertCriteria {
  codingTargetType: CodingTargetType;
  toscMinLevel: number;
  altCourse: CodingAltCourse;
}

/** 졸업인증 기준 전체 데이터 */
export interface CertificationCriteriaData {
  criteriaTarget: CriteriaTarget;
  certPolicy: CertPolicy;
  englishCertCriteria: EnglishCertCriteria | null;
  classicCertCriteria: ClassicCertCriteria;
  codingCertCriteria: CodingCertCriteria | null;
}

export async function fetchCertificationCriteria(): Promise<CertificationCriteriaData> {
  return await fetchJsonOnAPI<CertificationCriteriaData>('/api/graduation/certifications/criteria');
}

// ---- 입학년도 기준 학과 조회 API ----

/** 입학년도 기준 학과 정보 */
export interface AdmissionYearDepartment {
  deptCd: string;
  deptNm: string;
  collegeNm: string;
  deptGroup: string;
  englishTargetType: string;
  codingTargetType: string;
}

/** 입학년도 기준 학과 조회 API 응답 */
export interface AdmissionYearDepartmentsResponse {
  admissionYear: number;
  departments: AdmissionYearDepartment[];
}

export async function fetchAdmissionYearDepartments(): Promise<AdmissionYearDepartmentsResponse> {
  return await fetchJsonOnAPI<AdmissionYearDepartmentsResponse>('/api/graduation/departments');
}

// ---- 카테고리별 기준 조회 API ----

/** 균형교양 영역 타입 */
export type BalanceRequiredArea = 'HISTORY_THOUGHT' | 'CULTURE_ARTS' | 'ECONOMY_SOCIETY' | 'NATURE_SCIENCE';

/** 균형교양 영역별 과목 */
export interface BalanceAreaCourses {
  balanceRequiredArea: BalanceRequiredArea;
  requiredCourses: MissingCourse[];
}

/** 카테고리별 기준 정보 */
export interface CriteriaCategory {
  majorScope: ScopeType;
  categoryType: CategoryType;
  isEnabled: boolean;
  requiredCredits: number;
  requiredCourses: MissingCourse[];
  requiredAreasCnt: number | null;
  balanceAreaCourses: BalanceAreaCourses[] | null;
  excludedArea: BalanceRequiredArea | null;
}

/** 카테고리 기준 컨텍스트 */
export interface CriteriaCategoriesContext {
  admissionYear: number;
  majorType: 'SINGLE' | 'DOUBLE';
  primaryDeptCd: string;
  primaryDeptNm: string;
  doubleDeptCd: string;
  doubleDeptNm: string;
}

/** 카테고리 기준 API 응답 */
export interface CriteriaCategoriesResponse {
  context: CriteriaCategoriesContext;
  categories: CriteriaCategory[];
}

export async function fetchCriteriaCategories(): Promise<CriteriaCategoriesResponse> {
  return await fetchJsonOnAPI<CriteriaCategoriesResponse>('/api/graduation/criteria/categories');
}
