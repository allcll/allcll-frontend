import { useQuery } from '@tanstack/react-query';
import type {
  CategoryProgress,
  Certifications,
  ClassicCertCriteria,
  CodingCertCriteria,
  CreditSummary,
  CriteriaCategory,
  EnglishCertCriteria,
  GraduationCourse,
} from '@allcll/common';
import { fetchJsonOnAPI } from '@/utils/api';

type MajorType = 'SINGLE' | 'DOUBLE';

export interface AdminGraduationUser {
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

interface GraduationCheckData {
  checkId: number;
  createdAt: string;
  isGraduatable: boolean;
  summary: CreditSummary;
  categories: CategoryProgress[];
  certifications: Certifications;
}

interface GraduationCourses {
  createdAt: string | null;
  courses: GraduationCourse[];
}

interface CriteriaCategoriesContext {
  admissionYear: number;
  majorType: MajorType;
  primaryDeptCd: string;
  primaryDeptNm: string;
  doubleDeptCd: string | null;
  doubleDeptNm: string | null;
}

interface CriteriaCategoriesResponse {
  context: CriteriaCategoriesContext;
  categories: CriteriaCategory[];
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
    staleTime: 1000 * 60 * 5,
  });
}
