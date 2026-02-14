export type MajorType = 'SINGLE' | 'DOUBLE'; //이외 타입 추가시 => 'MINOR', 'INTERDISCIPLINARY' 추가

export interface UserResponse {
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

export interface LoginRequest {
  studentId: string;
  password: string;
}

/**
 * 사용자 정보 수정 요청 타입입니다.
 * 각 필드별 null인 경우를 참고하여주세요.
 * 복수 전공일 경우: deptNm: null, majorType: 'DOUBLE', doubleDeptNm: 복수전공학과명
 * 전과일 경우: deptNm: 전과 학과명, majorType: 'SINGLE', doubleDeptNm: null
 * 전과도 하고 복수전공일경우: deptNm: 전과 학과명, majorType: 'DOUBLE', doubleDeptNm: 복수전공학과명
 */
export interface UpdateMeRequest {
  deptNm: string | null;
  majorType: MajorType;
  doubleDeptNm: string | null;
}
