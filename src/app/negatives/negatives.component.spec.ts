import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NegativesComponent } from './negatives.component';
import { BinarySystems, ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
const bigInt = require('big-integer');

describe('Component: Negatives', () => {

  let comp: NegativesComponent;
  let fixture: ComponentFixture<NegativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ NegativesComponent ],
      providers: [ConversionsService, MetaDataService],
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativesComponent);
    comp = fixture.componentInstance;
  });

  describe('negative conversions', () => {
    it('sign and Magnitude', () => {
      const result = comp.calculateSignAndMagnitude(bigInt(123), 8);

      expect(result[BinarySystems.BINARY]).toBe('1111 1011');
    });

    it('one\'s complement', () => {
      const result = comp.calculateOnesComplement(bigInt(123), 8);

      expect(result[BinarySystems.BINARY]).toBe('1000 0100');
    });

    it('two\'s complement', () => {
      const result = comp.calculateTwosComplement(bigInt(123), 8);

      expect(result[BinarySystems.BINARY]).toBe('1000 0101');
    });

    it('test out of range', () => {
      // we set up 8 bits, so 130 is out of range [-128, 127]
      expect(() => comp.calculateTwosComplement(bigInt(130), 8)).toThrowError('Bit amount not big enough.');
    });
  });
});
