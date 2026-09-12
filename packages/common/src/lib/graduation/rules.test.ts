import { describe, it, expect } from 'vitest';
import {
  findCategory,
  filterCategories,
  isMajorSatisfied,
  isGeneralSatisfied,
  calculateProgress,
  calculateOverallProgress,
  getScopeTypes,
  filterCategoriesByScope,
} from './rules';
import type { CategoryProgress, GraduationCheckData } from '../../types/graduation';

describe('Graduation Rules', () => {
  const mockCategories: CategoryProgress[] = [
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 15,
      requiredCredits: 15,
      remainingCredits: 0,
      earnedAreasCnt: null,
      requiredAreasCnt: null,
      earnedAreas: null,
      satisfied: true,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'MAJOR_ELECTIVE',
      earnedCredits: 20,
      requiredCredits: 30,
      remainingCredits: 10,
      earnedAreasCnt: null,
      requiredAreasCnt: null,
      earnedAreas: null,
      satisfied: false,
    },
    {
      majorScope: 'PRIMARY',
      categoryType: 'COMMON_REQUIRED',
      earnedCredits: 10,
      requiredCredits: 10,
      remainingCredits: 0,
      earnedAreasCnt: null,
      requiredAreasCnt: null,
      earnedAreas: null,
      satisfied: true,
    },
    {
      majorScope: 'SECONDARY',
      categoryType: 'MAJOR_REQUIRED',
      earnedCredits: 12,
      requiredCredits: 12,
      remainingCredits: 0,
      earnedAreasCnt: null,
      requiredAreasCnt: null,
      earnedAreas: null,
      satisfied: true,
    },
  ];

  describe('findCategory', () => {
    it('should find the correct category by type', () => {
      const result = findCategory(mockCategories, 'COMMON_REQUIRED');
      expect(result).toBeDefined();
      expect(result?.earnedCredits).toBe(10);
    });

    it('should return undefined if category type is not found', () => {
      const result = findCategory(mockCategories, 'GENERAL_ELECTIVE');
      expect(result).toBeUndefined();
    });
  });

  describe('filterCategories', () => {
    it('should filter categories by a list of types', () => {
      const result = filterCategories(mockCategories, ['MAJOR_REQUIRED', 'COMMON_REQUIRED']);
      expect(result.length).toBe(3); // 2 MAJOR_REQUIRED and 1 COMMON_REQUIRED
      expect(result.map(c => c.categoryType)).toContain('MAJOR_REQUIRED');
      expect(result.map(c => c.categoryType)).toContain('COMMON_REQUIRED');
    });
  });

  describe('isMajorSatisfied', () => {
    it('should return false if any major category is not satisfied', () => {
      // In mockCategories, MAJOR_ELECTIVE is satisfied: false
      expect(isMajorSatisfied(mockCategories)).toBe(false);
    });

    it('should return true if all major categories are satisfied', () => {
      const allSatisfied: CategoryProgress[] = [
        { ...mockCategories[0] }, // MAJOR_REQUIRED, satisfied: true
        { ...mockCategories[1], satisfied: true }, // MAJOR_ELECTIVE, satisfied: true
      ];
      expect(isMajorSatisfied(allSatisfied)).toBe(true);
    });
  });

  describe('isGeneralSatisfied', () => {
    it('should return true if all general categories are satisfied', () => {
      const generalCategoriesOnly: CategoryProgress[] = [
        { ...mockCategories[2] }, // COMMON_REQUIRED, satisfied: true
        {
          majorScope: 'PRIMARY',
          categoryType: 'BALANCE_REQUIRED',
          earnedCredits: 6,
          requiredCredits: 6,
          remainingCredits: 0,
          earnedAreasCnt: null,
          requiredAreasCnt: null,
          earnedAreas: null,
          satisfied: true,
        },
      ];
      expect(isGeneralSatisfied(generalCategoriesOnly)).toBe(true);
    });

    it('should return false if any general category is not satisfied', () => {
      const generalCategoriesOnly: CategoryProgress[] = [
        { ...mockCategories[2] }, // COMMON_REQUIRED, satisfied: true
        {
          majorScope: 'PRIMARY',
          categoryType: 'BALANCE_REQUIRED',
          earnedCredits: 3,
          requiredCredits: 6,
          remainingCredits: 3,
          earnedAreasCnt: null,
          requiredAreasCnt: null,
          earnedAreas: null,
          satisfied: false,
        },
      ];
      expect(isGeneralSatisfied(generalCategoriesOnly)).toBe(false);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate percentage and round it', () => {
      expect(calculateProgress(10, 30)).toBe(33);
      expect(calculateProgress(20, 30)).toBe(67);
      expect(calculateProgress(30, 30)).toBe(100);
    });

    it('should return 100 if required credits is 0', () => {
      expect(calculateProgress(5, 0)).toBe(100);
    });
  });

  describe('calculateOverallProgress', () => {
    it('should calculate overall progress from GraduationCheckData', () => {
      const mockData = {
        checkId: 1,
        createdAt: '2026-07-26T22:00:00Z',
        isGraduatable: false,
        summary: {
          totalMyCredits: 75,
          requiredTotalCredits: 130,
          remainingCredits: 55,
        },
        categories: [],
        certifications: {},
      } as unknown as GraduationCheckData;
      // 75 / 130 = 0.5769... -> 58%
      expect(calculateOverallProgress(mockData)).toBe(58);
    });
  });

  describe('getScopeTypes', () => {
    it('should return scope types based on major scheme', () => {
      expect(getScopeTypes('SINGLE')).toEqual(['PRIMARY']);
      expect(getScopeTypes('DOUBLE')).toEqual(['PRIMARY', 'SECONDARY']);
      expect(getScopeTypes('MINOR')).toEqual(['PRIMARY', 'MINOR']);
    });
  });

  describe('filterCategoriesByScope', () => {
    it('should filter categories by majorScope and categoryTypes', () => {
      const result = filterCategoriesByScope(mockCategories, 'SECONDARY', ['MAJOR_REQUIRED']);
      expect(result.length).toBe(1);
      expect(result[0].majorScope).toBe('SECONDARY');
      expect(result[0].categoryType).toBe('MAJOR_REQUIRED');
    });

    it('should return empty list if none match scope and type', () => {
      const result = filterCategoriesByScope(mockCategories, 'MINOR', ['MAJOR_REQUIRED']);
      expect(result.length).toBe(0);
    });
  });
});
