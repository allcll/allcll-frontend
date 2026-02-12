import { UserType } from '../../utils/graduation-state';

export const userProfiles: Record<UserType, any> = {
  SINGLE: {
    userId: 123,
    studentId: "21011841",
    studentName: "남해윤",
    deptName: "데이터사이언스학과",
    deptCd: "38191",
    majorType: "SINGLE"
  },
  DOUBLE: {
    userId: 124,
    studentId: "20011842",
    studentName: "김복수",
    deptName: "데이터사이언스학과",
    deptCd: "38191",
    majorType: "DOUBLE",
    doubleDeptNm: "컴퓨터공학과"
  },
  TRANSFER: {
    userId: 125,
    studentId: "19011843",
    studentName: "이전과",
    deptName: "콘텐츠소프트웨어학과",
    deptCd: "3523",
    majorType: "SINGLE", // 전과 후 단일전공 가정
    doubleDeptNm: null
  }
};
