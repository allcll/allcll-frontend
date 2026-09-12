import { describe, it, expect } from 'vitest';
import {
  getStatusLabel,
  getStatusBadgeVariant,
  CATEGORY_TYPE_LABELS,
  CLASSIC_DOMAIN_LABELS,
  SCOPE_TYPE_LABELS,
  BALANCE_AREA_LABELS,
} from './mappers';

describe('Graduation Mappers', () => {
  describe('getStatusLabel', () => {
    it('should return "이수 완료" when satisfied is true', () => {
      expect(getStatusLabel(true)).toBe('이수 완료');
    });

    it('should return "미이수" when satisfied is false', () => {
      expect(getStatusLabel(false)).toBe('미이수');
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('should return "success" when satisfied is true', () => {
      expect(getStatusBadgeVariant(true)).toBe('success');
    });

    it('should return "danger" when satisfied is false', () => {
      expect(getStatusBadgeVariant(false)).toBe('danger');
    });
  });

  describe('Static Labels', () => {
    it('should map category types correctly', () => {
      expect(CATEGORY_TYPE_LABELS.COMMON_REQUIRED).toBe('공통교양');
      expect(CATEGORY_TYPE_LABELS.MAJOR_REQUIRED).toBe('전공필수');
      expect(CATEGORY_TYPE_LABELS.TOTAL_COMPLETION).toBe('총이수학점');
    });

    it('should map classic domain labels correctly', () => {
      expect(CLASSIC_DOMAIN_LABELS.WESTERN_HISTORY_THOUGHT).toBe('서양의역사와사상');
      expect(CLASSIC_DOMAIN_LABELS.SCIENCE_THOUGHT).toBe('과학 사상');
    });

    it('should map scope type labels correctly', () => {
      expect(SCOPE_TYPE_LABELS.PRIMARY).toBe('주전공');
      expect(SCOPE_TYPE_LABELS.SECONDARY).toBe('복수전공');
      expect(SCOPE_TYPE_LABELS.MINOR).toBe('부전공');
    });

    it('should map balance area labels correctly', () => {
      expect(BALANCE_AREA_LABELS.HISTORY_THOUGHT).toBe('역사와 사상');
      expect(BALANCE_AREA_LABELS.NATURE_SCIENCE).toBe('자연과 과학');
    });
  });
});
