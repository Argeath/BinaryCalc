import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import * as bigInt from 'big-integer';
import { Angulartics2 } from 'angulartics2';
import throttle from 'lodash/throttle';

@Component({
  selector: 'app-negatives',
  templateUrl: './negatives.component.html',
  styleUrls: ['./negatives.component.scss']
})
export class NegativesComponent implements OnInit {

  public systemManuallySelected = false;
  public bitsManuallySelected = false;

  public bitsArray = [];
  public systems = [];
  public error: string = null;

  public results = [
    {
      name: 'sign and magnitude', // znak-moduł
      data: [],
      error: null
    },
    {
      name: 'Ones\' complement', // U1
      data: [],
      error: null
    },
    {
      name: 'Two\'s complement', // U2
      data: [],
      error: null
    }
  ];

  public tags = [
    'binary calculator',
    'negative numbers',
    'negative numeralSystems',
    'negative operations',
    'negative representation',
    'negative binary',
    'negative hexadecimal',
    'negative sign',
    'signed magnitude calculator',
    'signed magnitude',
    'sign magnitude',
    'signed binary calculator',
    'sign binary calculator',
    'hexadecimal sign calculator',
    'signed binary converter',
    'sign hexadecimal converter',
    'signed magnitude binary calculator',
    'sign and magnitude',
    'ones complement',
    'twos complement',
    'negative U1',
    'negative U2',
    'znak modul'
  ];

  private _value = '';

  get value() {
    return this._value;
  }
  set value(newValue: string) {
    this._value = newValue.trim();
    this.valueChange();
  }

  private _system = 0;

  get system() {
    return this._system;
  }
  set system(newSystem: number) {
    if (this._system !== newSystem) {
      this._system = newSystem;
      this.valueChange();
    }
  }

  private _bits = 0;

  get bits() {
    return this._bits;
  }
  set bits(newSystem: number) {
    if (this._bits !== newSystem) {
      this._bits = newSystem;
      this.valueChange();
    }
  }

  constructor(private conversions: ConversionsService, private meta: MetaDataService, private ga: Angulartics2) {
    this.systems = conversions.binarySystems;
    this.bitsArray = conversions.bitsArray;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - negative Numbers Representations: ' +
      'Signed magnitude, Ones\' Complement, Two\'s Complement');
  }

  public systemSelected() {
    this.systemManuallySelected = true;

    this.ga.eventTrack.next({
      action: 'select system',
      properties: {
        category: 'negative',
        label: this.system
      }
    });
  }

  public bitsSelected() {
    this.bitsManuallySelected = true;

    this.ga.eventTrack.next({
      action: 'select bits',
      properties: {
        category: 'negative',
        label: this.bits
      }
    });
  }

  public valueChange() {
    return throttle(() => {
      const str = this.value.replace(/\s+/g, '').replace(/-/g, '');

      this.detectSystem(str);
      this.detectBitLength(str);

      let dec: bigInt.BigInteger = bigInt(0);
      try {
        dec = bigInt(str, this.systems[this.system].nr);

        if (isNaN(dec.valueOf())) {
          this.error = 'Incorrect value for that number system.';
          return false;
        }

        this.error = null;

      } catch (e) {
        this.error = e;
        return false;
      }

      this.ga.eventTrack.next({
        action: 'calculate',
        properties: {
          category: 'negative',
          label: `${dec} (${this.system} - ${this.bits})`
        }
      });

      // Z-M
      try {
        this.results[0].data = this.calculateSignAndMagnitude(dec, this.bits);
        this.results[0].error = null;

      } catch (e) {
        this.results[0].error = e;
      }

      // U1
      try {
        this.results[1].data = this.calculateOnesComplement(dec, this.bits);
        this.results[1].error = null;

      } catch (e) {
        this.results[1].error = e;
      }

      // U2
      try {
        this.results[2].data = this.calculateTwosComplement(dec, this.bits);
        this.results[2].error = null;

      } catch (e) {
        this.results[2].error = e;
      }
    }, 1000)();
  }

  public calculateSignAndMagnitude(dec: bigInt.BigInteger, bits: number): string[] {
    const maxVal = ConversionsService.pow2(bits - 1);

    if (dec.compareAbs(maxVal) === -1) { // dec < maxVal
      const zmVal = dec.add(maxVal); // 2^8, 2^16 ...
      const result: string[] = [];

      for (let i = 0; i < this.systems.length; i++) {
        let str = zmVal.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        result[i] = str.toUpperCase();
      }

      return result;
    }

    throw new Error('Bit amount not big enough.');
  }

  public calculateOnesComplement(dec: bigInt.BigInteger, bits: number): string[] {
    const maxVal = ConversionsService.pow2(bits - 1);
    const mask = ConversionsService.pow2(bits).minus(1);
    const neg = dec.not().and(mask);

    if (dec.compareAbs(maxVal) === -1) {
      const result: string[] = [];

      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        result[i] = str.toUpperCase();
      }

      return result;
    }

    throw new Error('Bit amount not big enough.');
  }

  public calculateTwosComplement(dec: bigInt.BigInteger, bits: number): string[] {
    const maxVal = ConversionsService.pow2(bits - 1);
    const mask = ConversionsService.pow2(bits).minus(1);
    const neg = dec.not().and(mask).add(1);

    if (dec.compareAbs(maxVal.add(1)) === -1) {
      const result: string[] = [];

      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        result[i] = str.toUpperCase();
      }

      return result;
    }

    throw new Error('Bit amount not big enough.');
  }

  private detectSystem(str: string) {
    if (!this.systemManuallySelected) {
      if (this.value.length === 0) {
        this.system = 0;
      } else {
        const systemFound = this.conversions.detectSystem(str, true);
        if (systemFound) {
          this.system = systemFound;
        }
      }
    }
  }

  private detectBitLength(str: string) {
    if (!this.bitsManuallySelected) {
      if (this.value.length === 0) {
        this.bits = 0;
      } else {
        const bitsFound = this.conversions.detectBitLengthForNegative(str,
          this.systems[this.system].nr, true);

        if (bitsFound) {
          this.bits = bitsFound;
        }
      }
    }
  }
}
