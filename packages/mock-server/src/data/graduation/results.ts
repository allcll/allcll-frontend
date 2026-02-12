import { GraduationStep } from '../../utils/graduation-state';

export const checkResults: Record<GraduationStep, any> = {
  NO_FILE: null, // 파일 없음 상태에서는 결과가 없음 (404 처리 예정)
  PROCESSING: null, // 처리 중 상태 (필요 시 사용)
  DONE: {
    checkId: 1,
    createdAt: "2026-01-30T16:00:00+09:00",
    isGraduatable: false,
    summary: {
      totalCredits: 98,
      requiredTotalCredits: 130,
      remainingCredits: 32
    },
    categories: [
      {
        scope: "PRIMARY",
        categoryType: "MAJOR_REQUIRED",
        earnedCredits: 12,
        requiredCredits: 15,
        remainingCredits: 3,
        satisfied: false
      }
    ],
    recommendations: {
      requiredCourses: [
        {
          scope: "PRIMARY",
          categoryType: "COMMON_REQUIRED",
          missingCourses: [
            { curiNo: "000XX", curiNm: "신입생세미나A" }
          ]
        }
      ]
    },
    certifications: {
      policy: {
        ruleType: "ANY_TWO_OF_THREE",
        requiredPassCount: 2
      },
      passedCount: 1,
      requiredPassCount: 2,
      isSatisfied: false,
      english: {
        passed: false,
        targetType: "NON_MAJOR"
      },
      coding: {
        passed: false,
        targetType: "MAJOR"
      },
      classic: {
        passed: true,
        total: {
          requiredCount: 0,
          myCount: 0
        },
        domains: [
          {
            domainType: "WESTERN_HISTORY_THOUGHT",
            requiredCount: 4,
            myCount: 1,
            satisfied: false
          },
          {
            domainType: "EASTERN_HISTORY_THOUGHT",
            requiredCount: 2,
            myCount: 2,
            satisfied: true
          },
          {
            domainType: "EAST_WEST_LITERATURE",
            requiredCount: 3,
            myCount: 3,
            satisfied: true
          },
          {
            domainType: "SCIENCE_THOUGHT",
            requiredCount: 1,
            myCount: 1,
            satisfied: true
          }
        ]
      }
    }
  }
};
