import { fetchJsonOnAPI } from '@/shared/api/api';

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
export type ScopeType = 'PRIMARY' | 'DOUBLE' | 'MINOR';

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
  required: boolean;
  targetType: CertificationTargetType;
}

/** 코딩 인증 */
export interface CodingCertification {
  passed: boolean;
  required: boolean;
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
  required: boolean;
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

export async function fetchGraduationCheck(): Promise<GraduationCheckResponse> {
  return await fetchJsonOnAPI<GraduationCheckResponse>('/api/graduation/check');
}

// ---- 졸업인증 기준 조회 API ----

/** 졸업인증 기준 - 학생 컨텍스트 */
export interface CertificationCriteriaContext {
  admissionYear: number;
  deptName: string;
  deptGroup: string;
  englishTargetType: CertificationTargetType;
  codingTargetType: CertificationTargetType;
  collegeName: string;
  deptCd: string;
}

/** 졸업인증 기준 - 정책 */
export interface CertificationCriteriaPolicy {
  ruleType: CertificationRuleType;
  requiredPassCount: number;
  enableEnglish: boolean;
  enableClassic: boolean;
  enableCoding: boolean;
}

/** 대체 과목 정보 */
export interface AltCourse {
  name?: string;
  curiNo?: number;
  credit?: number;
  minGrade?: string;
}

/** 영어 인증 기준 */
export interface EnglishCriteria {
  targetType: CertificationTargetType;
  toeicMinScore: number;
  toeflIbtMinScore: number;
  tepsMinScore: number;
  newTepsMinScore: number;
  opicMinLevel: string;
  toeicSpeakingMinLevel: string;
  gtelpLevel: number;
  gtelpMinScore: number;
  gtelpSpeakingLevel: number;
  altCourse: AltCourse;
}

/** 고전독서 인증 기준 */
export interface ClassicCriteria {
  totalRequiredCount: number;
  requiredCountWestern: number;
  requiredCountEastern: number;
  requiredCountEasternAndWestern: number;
  requiredCountScience: number;
}

/** 코딩 인증 기준 */
export interface CodingCriteria {
  targetType: CertificationTargetType;
  toscMinLevel: number;
  alt1: AltCourse;
  alt2: AltCourse;
}

/** 졸업인증 기준 전체 데이터 */
export interface CertificationCriteriaData {
  context: CertificationCriteriaContext;
  policy: CertificationCriteriaPolicy;
  englishCriteria: EnglishCriteria;
  classicCriteria: ClassicCriteria;
  codingCriteria: CodingCriteria;
}

/** 졸업인증 기준 API 응답 */
export interface CertificationCriteriaResponse {
  data: CertificationCriteriaData;
}

export async function fetchCertificationCriteria(): Promise<CertificationCriteriaResponse> {
  return await fetchJsonOnAPI<CertificationCriteriaResponse>('/api/graduation/certifications/criteria');
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
