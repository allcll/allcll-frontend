import { UserType } from '../../utils/graduation-state';

export const criteriaData: Record<UserType, any> = {
  SINGLE: {
    context: {
      admissionYear: 2023,
      deptName: "콘텐츠소프트웨어학과",
      deptGroup: "NATURAL_SCI",
      englishTargetType: "NON_MAJOR",
      codingTargetType: "MAJOR",
      collegeName: "인공지능융합대학",
      deptCd: "3523"
    },
    policy: {
      ruleType: "ANY_TWO_OF_THREE",
      requiredPassCount: 2,
      enableEnglish: true,
      enableClassic: true,
      enableCoding: true
    },
    englishCriteria: {
      targetType: "NON_MAJOR",
      toeicMinScore: 800,
      toeflIbtMinScore: 80,
      tepsMinScore: 637,
      newTepsMinScore: 348,
      opicMinLevel: "IM1",
      toeicSpeakingMinLevel: "IM1",
      gtelpLevel: 2,
      gtelpMinScore: 77,
      gtelpSpeakingLevel: 4,
      altCourse: {
        altCuriNo: 1111,
        altCuriNm: "Intensive English",
        altCuriCredit: 3
      }
    },
    classicCriteria: {
      totalRequiredCount: 10,
      requiredCountWestern: 4,
      requiredCountEastern: 2,
      requiredCountEasternAndWestern: 3,
      requiredCountScience: 1
    },
    codingCriteria: {
      targetType: "MAJOR",
      toscMinLevel: 3,
      altCourse: {
        alt1CuriNo: 1111,
        alt1CuriNm: "고급C프로그래밍실습",
        alt1MinGrade: "B0"
      }
    }
  },
  DOUBLE: {
    // 복수전공자 기준 데이터 (예시)
    context: {
      admissionYear: 2023,
      deptName: "데이터사이언스학과",
      deptGroup: "NATURAL_SCI",
      englishTargetType: "NON_MAJOR",
      codingTargetType: "MAJOR",
      collegeName: "인공지능융합대학",
      deptCd: "38191"
    },
    policy: {
      ruleType: "ANY_TWO_OF_THREE",
      requiredPassCount: 2,
      enableEnglish: true,
      enableClassic: true,
      enableCoding: true
    },
    englishCriteria: {
      targetType: "NON_MAJOR",
      toeicMinScore: 800,
      // ... (생략)
    },
    classicCriteria: {
      totalRequiredCount: 10,
      requiredCountWestern: 4,
      requiredCountEastern: 2,
      requiredCountEasternAndWestern: 3,
      requiredCountScience: 1
    },
    codingCriteria: {
      targetType: "MAJOR",
      toscMinLevel: 3,
      altCourse: {
        alt1CuriNo: 1111,
        alt1CuriNm: "고급C프로그래밍실습",
        alt1MinGrade: "B0"
      }
    }
  },
  TRANSFER: {
    // 전과생 기준 데이터 (예시)
    context: {
      admissionYear: 2023,
      deptName: "콘텐츠소프트웨어학과",
      deptGroup: "NATURAL_SCI",
      englishTargetType: "NON_MAJOR",
      codingTargetType: "MAJOR",
      collegeName: "인공지능융합대학",
      deptCd: "3523"
    },
    policy: {
      ruleType: "ANY_TWO_OF_THREE",
      requiredPassCount: 2,
      enableEnglish: true,
      enableClassic: true,
      enableCoding: true
    },
    englishCriteria: {
      targetType: "NON_MAJOR",
      toeicMinScore: 800,
      // ... (생략)
    },
    classicCriteria: {
      totalRequiredCount: 10,
      requiredCountWestern: 4,
      requiredCountEastern: 2,
      requiredCountEasternAndWestern: 3,
      requiredCountScience: 1
    },
    codingCriteria: {
      targetType: "MAJOR",
      toscMinLevel: 3,
      altCourse: {
        alt1CuriNo: 1111,
        alt1CuriNm: "고급C프로그래밍실습",
        alt1MinGrade: "B0"
      }
    }
  }
};
