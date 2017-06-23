import { BinarySystems, ConversionsService, NumeralSystems } from './conversions.service';
import { TestBed } from '@angular/core/testing';

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
      expect(result).toBe(NumeralSystems.ARABIC);
    });

    it('roman system', () => {
      const result = ConversionsService.detectNumeralSystem('DXLI');
      expect(result).toBe(NumeralSystems.ROMAN);
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

  describe('Binary system detection', () => {
    it('detects binary', () => {
      const result = service.detectSystem('1101', true);
      expect(result).toBe(BinarySystems.BINARY);
    });

    it('skips octal and detects decimal', () => {
      const result = service.detectSystem('123', true);
      expect(result).toBe(BinarySystems.DECIMAL);
    });

    it('detects hexadecimal', () => {
      const result = service.detectSystem('5A3C', true);
      expect(result).toBe(BinarySystems.HEXADECIMAL);
    });
  });

  describe('Binary system validation', () => {
    it('validates binary', () => {
      const result = ConversionsService.validateSystem('1101', 2);
      const resultFalse = ConversionsService.validateSystem('1102', 2);

      expect(result).toBe(true);
      expect(resultFalse).toBe(false);
    });

    it('validates hexadecimal', () => {
      const result = ConversionsService.validateSystem('1F43', 16);
      const resultFalse = ConversionsService.validateSystem('1FG2', 16);

      expect(result).toBe(true);
      expect(resultFalse).toBe(false);
    });
  });

  it('Fill bits with zeros to full bytes', () => {
    const result = ConversionsService.fillBitsToFullBytesWithZeros('11011', 2, 8);
    expect(result).toBe('00011011');
  });

  it('ASCII to hex number', () => {
    const result = ConversionsService.ASCIIToHexNumber('5'.charCodeAt(0));
    const result2 = ConversionsService.ASCIIToHexNumber('E'.charCodeAt(0));

    expect(result).toBe(5);
    expect(result2).toBe(14);
  });

  describe('Format', () => {
    it('binary', () => {
      const result = ConversionsService.format('11011101', 2);
      expect(result).toBe('1101 1101');
    });

    it('octal', () => {
      const result = ConversionsService.format('12361', 8);
      expect(result).toBe('12 361');
    });

    it('decimal', () => {
      const result = ConversionsService.format('82961', 10);
      expect(result).toBe('82 961');
    });

    it('hexadecimal', () => {
      const result = ConversionsService.format('C1F6E2A', 16);
      expect(result).toBe('C 1F 6E 2A');
    });
  });

  it('GetHighestNumeral works correctly', () => {
    const result = ConversionsService.getHighestNumeral('1B9A');
    const result2 = ConversionsService.getHighestNumeral('4123');

    expect(result).toBe(11); // B
    expect(result2).toBe(4);
  });
});
