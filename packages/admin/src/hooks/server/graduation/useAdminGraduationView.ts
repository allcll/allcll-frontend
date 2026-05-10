import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api';

type MajorType = 'SINGLE' | 'DOUBLE';

interface AdminGraduationUser {
  id: number;
  studentId: string;
  name: string;
  admissionYear: number;
  majorType: MajorType;
  collegeName: string;
  deptName: string;
  deptCode: string;
  doubleCollegeName: string | null;
  doubleDeptName: string | null;
  doubleDeptCode: string | null;
}

interface CreditSummary {
  totalMyCredits: number;
  requiredTotalCredits: number;
  remainingCredits: number;
}

export type CategoryType =
  | 'COMMON_REQUIRED'
  | 'BALANCE_REQUIRED'
  | 'ACADEMIC_BASIC'
  | 'GENERAL_ELECTIVE'
  | 'MAJOR_REQUIRED'
  | 'MAJOR_ELECTIVE'
  | 'MAJOR_BASIC'
  | 'TOTAL_COMPLETION'
  | 'GENERAL';

export type ScopeType = 'PRIMARY' | 'SECONDARY' | 'MINOR';

export type BalanceRequiredArea = 'HISTORY_THOUGHT' | 'CULTURE_ARTS' | 'ECONOMY_SOCIETY' | 'NATURE_SCIENCE';

interface CategoryProgress {
  majorScope: ScopeType;
  categoryType: CategoryType;
  earnedCredits: number;
  requiredCredits: number;
  remainingCredits: number;
  earnedAreasCnt: number | null;
  requiredAreasCnt: number | null;
  earnedAreas: BalanceRequiredArea[] | null;
  satisfied: boolean;
}

type EnglishTargetType = 'ENGLISH_MAJOR' | 'NON_MAJOR' | 'EXEMPT';
type CodingTargetType = 'CODING_MAJOR' | 'NON_MAJOR' | 'EXEMPT';

interface EnglishCertification {
  isPassed: boolean;
  isRequired: boolean;
  targetType: EnglishTargetType;
}

interface CodingCertification {
  isPassed: boolean;
  isRequired: boolean;
  targetType: CodingTargetType;
}

interface ClassicDomain {
  domainType: string;
  requiredCount: number;
  myCount: number;
  satisfied: boolean;
}

interface ClassicCertification {
  isPassed: boolean;
  isRequired: boolean;
  totalRequiredCount: number;
  totalMyCount: number;
  domains: ClassicDomain[];
}

interface CertificationPolicy {
  ruleType: string;
  requiredPassCount: number;
}

interface Certifications {
  policy: CertificationPolicy;
  isSatisfied: boolean;
  passedCount: number;
  requiredPassCount: number;
  english: EnglishCertification;
  coding: CodingCertification;
  classic: ClassicCertification;
}

interface GraduationCheckData {
  checkId: number;
  createdAt: string;
  isGraduatable: boolean;
  summary: CreditSummary;
  categories: CategoryProgress[];
  certifications: Certifications;
}

interface GraduationCourse {
  id: number;
  curiNo: string;
  curiNm: string;
  categoryType: CategoryType;
  selectedArea: string;
  credits: number;
  majorScope: ScopeType;
  isEarned: boolean;
}

interface GraduationCourses {
  createdAt: string | null;
  courses: GraduationCourse[];
}

interface CriteriaCategoriesContext {
  admissionYear: number;
  majorType: string;
  primaryDeptCd: string;
  primaryDeptNm: string;
  doubleDeptCd: string | null;
  doubleDeptNm: string | null;
}

export interface MissingCourse {
  curiNo: string;
  curiNm: string;
}

export interface BalanceAreaCourses {
  balanceRequiredArea: BalanceRequiredArea;
  requiredCourses: MissingCourse[];
}

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

interface CriteriaCategoriesResponse {
  context: CriteriaCategoriesContext;
  categories: CriteriaCategory[];
}

interface EnglishAltCourse {
  altCuriNo: string;
  altCuriNm: string;
  altCuriCredit: number;
}

export interface EnglishCertCriteria {
  englishTargetType: string;
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

export interface ClassicCertCriteria {
  totalRequiredCount: number;
  requiredCountWestern: number;
  requiredCountEastern: number;
  requiredCountEasternAndWestern: number;
  requiredCountScience: number;
}

interface CodingAltCourse {
  alt1CuriNo: string;
  alt1CuriNm: string;
  alt1MinGrade: string;
  alt2CuriNo: string | null;
  alt2CuriNm: string | null;
  alt2MinGrade: string | null;
}

export interface CodingCertCriteria {
  codingTargetType: string;
  toscMinLevel: number;
  altCourse: CodingAltCourse;
}

export interface CertificationCriteriaData {
  englishCertCriteria: EnglishCertCriteria | null;
  classicCertCriteria: ClassicCertCriteria;
  codingCertCriteria: CodingCertCriteria | null;
}

export interface AdminGraduationViewResponse {
  user: AdminGraduationUser;
  checkData: GraduationCheckData;
  courses: GraduationCourses;
  criteriaCategories: CriteriaCategoriesResponse;
  certificationCriteria: CertificationCriteriaData;
}

async function fetchAdminGraduationView(studentId: string): Promise<AdminGraduationViewResponse> {
  return await fetchJsonOnAPI<AdminGraduationViewResponse>(`/api/admin/graduation/${studentId}`);
}

export function useAdminGraduationView(studentId: string) {
  return useQuery({
    queryKey: ['admin', 'graduation', studentId],
    queryFn: () => fetchAdminGraduationView(studentId),
    staleTime: Infinity,
  });
}
