import { ConversionsService } from './conversions.service';
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
});
