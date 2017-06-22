import { ConversionsService } from './conversions.service';
import { TestBed } from '@angular/core/testing';
const bigInt = require('big-integer');

describe('Service: ConversionsService', () => {
  let service: ConversionsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [ConversionsService]
    });

    service = TestBed.get(ConversionsService);
  });

  // specs
  describe('should detect', () => {
    it('arabic system', () => {
      const result = ConversionsService.detectNumeralSystem('541');
      expect(result).toBe(ConversionsService.ARABIC);
    });

    it('roman system', () => {
      const result = ConversionsService.detectNumeralSystem('DXLI');
      expect(result).toBe(ConversionsService.ROMAN);
    });
  });

  describe('should get correct value from', () => {
    it('arabic system', () => {
      const result = ConversionsService.fromArabicToRoman(541);
      expect(result).toBe('DXLI');
    });

    it('roman system', () => {
      const result = ConversionsService.fromRomanToArabic('DXLI');
      expect(result).toBe(541);
    });
  });

  it('pow2 should return correct value', () => {
    const result = ConversionsService.pow2(5);
    expect(result.valueOf()).toBe(32); // 2^5
  });

  describe('Bit length detection', () => {
    it('should detect correct value', () => {
      const result = service.detectBitLength(0b1101101);
      expect(result).toBe(7);
    });

    it('should detect correct value (starts with 0)', () => {
      const result = service.detectBitLength(0b1101101);
      expect(result).toBe(7);
    });

    it('should detect pushed to full byte value', () => {
      const result = service.detectBitLength(0b1101101, true);
      expect(result).toBe(8);
    });
  });

  describe('Bit length for negative detection', () => {
    it('should detect correct value (left border)', () => {
      const result = service.detectBitLengthForNegative('127', 10, true);
      expect(result).toBe(8);
    });

    it('should detect correct value (right border)', () => {
      const result = service.detectBitLengthForNegative('128', 10, true);
      expect(result).toBe(16);
    });
  });
});
