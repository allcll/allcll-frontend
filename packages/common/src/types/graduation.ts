export interface CreditSummary {
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

export interface CategoryProgress {
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

export interface MissingCourse {
  curiNo: string;
  curiNm: string;
}

export type CertificationRuleType = 'BOTH_REQUIRED' | 'TWO_OF_THREE';

export interface CertificationPolicy {
  ruleType: CertificationRuleType;
  requiredPassCount: number;
}

export type CertificationTargetType = 'MAJOR' | 'NON_MAJOR' | 'CODING_MAJOR';

export interface EnglishCertification {
  isPassed: boolean;
  isRequired: boolean;
  targetType: CertificationTargetType;
}

export interface CodingCertification {
  isPassed: boolean;
  isRequired: boolean;
  targetType: CertificationTargetType;
}

export type ClassicDomainType =
  | 'WESTERN_HISTORY_THOUGHT'
  | 'EASTERN_HISTORY_THOUGHT'
  | 'EAST_WEST_LITERATURE'
  | 'SCIENCE_THOUGHT';

export interface ClassicDomain {
  domainType: ClassicDomainType;
  requiredCount: number;
  myCount: number;
  satisfied: boolean;
}

export interface ClassicCertification {
  isPassed: boolean;
  isRequired: boolean;
  totalRequiredCount: number;
  totalMyCount: number;
  domains: ClassicDomain[];
}

export interface Certifications {
  policy: CertificationPolicy;
  passedCount: number;
  requiredPassCount: number;
  isSatisfied: boolean;
  english: EnglishCertification;
  coding: CodingCertification;
  classic: ClassicCertification;
}

export interface GraduationCheckData {
  checkId: number;
  createdAt: string;
  isGraduatable: boolean;
  summary: CreditSummary;
  categories: CategoryProgress[];
  certifications: Certifications;
}

export type EnglishTargetType = 'ENGLISH_MAJOR' | 'NON_MAJOR' | 'EXEMPT';
export type CodingTargetType = 'CODING_MAJOR' | 'NON_MAJOR' | 'EXEMPT';

export interface EnglishAltCourse {
  altCuriNo: string;
  altCuriNm: string;
  altCuriCredit: number;
}

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

export interface ClassicCertCriteria {
  totalRequiredCount: number;
  requiredCountWestern: number;
  requiredCountEastern: number;
  requiredCountEasternAndWestern: number;
  requiredCountScience: number;
}

export interface CodingAltCourse {
  alt1CuriNo: string;
  alt1CuriNm: string;
  alt1MinGrade: string;
  alt2CuriNo: string | null;
  alt2CuriNm: string | null;
  alt2MinGrade: string | null;
}

export interface CodingCertCriteria {
  codingTargetType: CodingTargetType;
  toscMinLevel: number;
  altCourse: CodingAltCourse;
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

export interface GraduationCourse {
  id: number;
  curiNo: string;
  curiNm: string;
  categoryType: CategoryType;
  selectedArea: string;
  credits: number;
  majorScope: ScopeType;
  isEarned: boolean;
}

export interface GraduationCertificationCriteria {
  englishCertCriteria: EnglishCertCriteria | null;
  classicCertCriteria: ClassicCertCriteria;
  codingCertCriteria: CodingCertCriteria | null;
}

export type CertificationType = 'english' | 'classic' | 'coding';
