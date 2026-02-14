import { GraduationStep } from '../../utils/graduation-state';

const doubleNotGraduatable = {
  checkId: 1,
  createdAt: '2026-01-30T16:00:00+09:00',
  isGraduatable: false,
  summary: {
    totalMyCredits: 98,
    requiredTotalCredits: 130,
    remainingCredits: 32,
  },
  categories: [
    {
      majorScope: 'PRIMARY',
      categoryType: 'COMMON_REQUIRED',
      earnedCredits: 10,
      requiredCredits: 13,
      remainingCredits: 3,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'ACADEMIC_BASIC',
      earnedCredits: 12,
      requiredCredits: 12,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'GENERAL_ELECTIVE',
      earnedCredits: 12,
      requiredCredits: 15,
      remainingCredits: 3,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 12,
      requiredCredits: 15,
      remainingCredits: 3,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_ELECTIVE',
      earnedCredits: 18,
      requiredCredits: 21,
      remainingCredits: 3,
      satisfied: false,
    },
    {
      majorScope: 'SECONDARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 6,
      requiredCredits: 15,
      remainingCredits: 9,
      satisfied: false,
    },
    {
      majorScope: 'SECONDARY',
      categoryType: 'MAJOR_ELECTIVE',
      earnedCredits: 10,
      requiredCredits: 21,
      remainingCredits: 11,
      satisfied: false,
    },
  ],
  certifications: {
    policy: {
      ruleType: 'TWO_OF_THREE',
      requiredPassCount: 2,
    },
    passedCount: 1,
    requiredPassCount: 2,
    isSatisfied: false,
    english: {
      isPassed: false,
      isRequired: true,
      targetType: 'NON_MAJOR',
    },
    coding: {
      isPassed: true,
      isRequired: true,
      targetType: 'CODING_MAJOR',
    },
    classic: {
      isPassed: false,
      isRequired: true,
      totalRequiredCount: 10,
      totalMyCount: 7,
      domains: [
        {
          domainType: 'WESTERN_HISTORY_THOUGHT',
          requiredCount: 4,
          myCount: 3,
          isSatisfied: false,
        },
        {
          domainType: 'EASTERN_HISTORY_THOUGHT',
          requiredCount: 2,
          myCount: 2,
          isSatisfied: true,
        },
        {
          domainType: 'EAST_WEST_LITERATURE',
          requiredCount: 3,
          myCount: 2,
          isSatisfied: false,
        },
        {
          domainType: 'SCIENCE_THOUGHT',
          requiredCount: 1,
          myCount: 0,
          isSatisfied: false,
        },
      ],
    },
  },
};

const singleGraduatable = {
  checkId: 2,
  createdAt: '2026-02-14T10:00:00+09:00',
  isGraduatable: true,
  summary: {
    totalMyCredits: 132,
    requiredTotalCredits: 130,
    remainingCredits: 0,
  },
  categories: [
    {
      majorScope: 'PRIMARY',
      categoryType: 'COMMON_REQUIRED',
      earnedCredits: 13,
      requiredCredits: 13,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'ACADEMIC_BASIC',
      earnedCredits: 12,
      requiredCredits: 12,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'GENERAL_ELECTIVE',
      earnedCredits: 21,
      requiredCredits: 21,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 15,
      requiredCredits: 15,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_ELECTIVE',
      earnedCredits: 53,
      requiredCredits: 21,
      remainingCredits: 0,
      satisfied: true,
    },
  ],
  certifications: {
    policy: {
      ruleType: 'TWO_OF_THREE',
      requiredPassCount: 2,
    },
    passedCount: 3,
    requiredPassCount: 2,
    isSatisfied: true,
    english: {
      isPassed: true,
      isRequired: true,
      targetType: 'NON_MAJOR',
    },
    coding: {
      isPassed: true,
      isRequired: true,
      targetType: 'CODING_MAJOR',
    },
    classic: {
      isPassed: true,
      isRequired: true,
      totalRequiredCount: 10,
      totalMyCount: 12,
      domains: [
        {
          domainType: 'WESTERN_HISTORY_THOUGHT',
          requiredCount: 4,
          myCount: 5,
          isSatisfied: true,
        },
        {
          domainType: 'EASTERN_HISTORY_THOUGHT',
          requiredCount: 2,
          myCount: 2,
          isSatisfied: true,
        },
        {
          domainType: 'EAST_WEST_LITERATURE',
          requiredCount: 3,
          myCount: 4,
          isSatisfied: true,
        },
        {
          domainType: 'SCIENCE_THOUGHT',
          requiredCount: 1,
          myCount: 1,
          isSatisfied: true,
        },
      ],
    },
  },
};

const transferNotGraduatable = {
  checkId: 3,
  createdAt: '2026-02-14T11:00:00+09:00',
  isGraduatable: false,
  summary: {
    totalMyCredits: 72,
    requiredTotalCredits: 88,
    remainingCredits: 16,
  },
  categories: [
    {
      majorScope: 'PRIMARY',
      categoryType: 'COMMON_REQUIRED',
      earnedCredits: 10,
      requiredCredits: 10,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'ACADEMIC_BASIC',
      earnedCredits: 9,
      requiredCredits: 9,
      remainingCredits: 0,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'GENERAL_ELECTIVE',
      earnedCredits: 10,
      requiredCredits: 15,
      remainingCredits: 5,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 15,
      requiredCredits: 18,
      remainingCredits: 3,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_ELECTIVE',
      earnedCredits: 19,
      requiredCredits: 24,
      remainingCredits: 5,
      satisfied: false,
    },
  ],
  certifications: {
    policy: {
      ruleType: 'TWO_OF_THREE',
      requiredPassCount: 2,
    },
    passedCount: 2,
    requiredPassCount: 2,
    isSatisfied: true,
    english: {
      isPassed: true,
      isRequired: true,
      targetType: 'NON_MAJOR',
    },
    coding: {
      isPassed: false,
      isRequired: true,
      targetType: 'CODING_MAJOR',
    },
    classic: {
      isPassed: true,
      isRequired: true,
      totalRequiredCount: 10,
      totalMyCount: 10,
      domains: [
        {
          domainType: 'WESTERN_HISTORY_THOUGHT',
          requiredCount: 4,
          myCount: 4,
          isSatisfied: true,
        },
        {
          domainType: 'EASTERN_HISTORY_THOUGHT',
          requiredCount: 2,
          myCount: 2,
          isSatisfied: true,
        },
        {
          domainType: 'EAST_WEST_LITERATURE',
          requiredCount: 3,
          myCount: 3,
          isSatisfied: true,
        },
        {
          domainType: 'SCIENCE_THOUGHT',
          requiredCount: 1,
          myCount: 1,
          isSatisfied: true,
        },
      ],
    },
  },
};

export const checkResults: Record<GraduationStep, any> = {
  NO_FILE: null,
  PROCESSING: null,
  DONE: singleGraduatable,
};

export const checkResultsByUserType = {
  SINGLE: singleGraduatable,
  DOUBLE: doubleNotGraduatable,
  TRANSFER: transferNotGraduatable,
};

export { doubleNotGraduatable, singleGraduatable, transferNotGraduatable };
