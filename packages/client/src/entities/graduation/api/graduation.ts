import type {
  ClassicCertCriteria,
  CodingCertCriteria,
  CodingTargetType,
  CriteriaCategory,
  EnglishCertCriteria,
  EnglishTargetType,
  GraduationCheckData,
  GraduationCourse,
} from '@allcll/common';
import { fetchJsonOnAPI } from '@/shared/api/api';

export type CategoryGroup = 'major' | 'general';

export async function fetchGraduationCheck(): Promise<GraduationCheckData> {
  return await fetchJsonOnAPI<GraduationCheckData>('/api/graduation/check');
}

export interface CriteriaTarget {
  englishTargetType: EnglishTargetType;
  codingTargetType: CodingTargetType;
}

export type GraduationCertRuleType = 'BOTH_REQUIRED' | 'TWO_OF_THREE';

export interface CertPolicy {
  graduationCertRuleType: GraduationCertRuleType;
  requiredPassCount: number;
  enableEnglish: boolean;
  enableClassic: boolean;
  enableCoding: boolean;
}

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

export interface AdmissionYearDepartment {
  deptCd: string;
  deptNm: string;
  collegeNm: string;
  deptGroup: string;
  englishTargetType: string;
  codingTargetType: string;
}

export interface AdmissionYearDepartmentsResponse {
  admissionYear: number;
  departments: AdmissionYearDepartment[];
}

export async function fetchAdmissionYearDepartments(): Promise<AdmissionYearDepartmentsResponse> {
  return await fetchJsonOnAPI<AdmissionYearDepartmentsResponse>('/api/graduation/departments');
}

export interface CriteriaCategoriesContext {
  admissionYear: number;
  majorType: 'SINGLE' | 'DOUBLE';
  primaryDeptCd: string;
  primaryDeptNm: string;
  doubleDeptCd: string;
  doubleDeptNm: string;
}

export interface CriteriaCategoriesResponse {
  context: CriteriaCategoriesContext;
  categories: CriteriaCategory[];
}

export async function fetchCriteriaCategories(): Promise<CriteriaCategoriesResponse> {
  return await fetchJsonOnAPI<CriteriaCategoriesResponse>('/api/graduation/criteria/categories');
}

export interface GraduationCoursesResponse {
  createdAt: string | null;
  courses: GraduationCourse[];
}

export async function fetchGraduationCourses(): Promise<GraduationCoursesResponse> {
  return await fetchJsonOnAPI<GraduationCoursesResponse>('/api/graduation/courses');
}
