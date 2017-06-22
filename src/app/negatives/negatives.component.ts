import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import { BigInteger } from 'big-integer';
const bigInt = require('big-integer');

@Component({
  selector: 'app-negatives',
  templateUrl: './negatives.component.html',
  styleUrls: ['./negatives.component.scss']
})
export class NegativesComponent implements OnInit {

  public systemManuallySelected: boolean = false;
  public bitsManuallySelected: boolean = false;

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
      name: "Ones' complement", // U1
      data: [],
      error: null
    },
    {
      name: "Two's complement", // U2
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

  private _value: string = '';

  get value() {
    return this._value;
  }
  set value(newValue: string) {
    this._value = newValue.trim();
    this.valueChange();
  }

  private _system: number = 0;

  get system() {
    return this._system;
  }
  set system(newSystem: number) {
    this._system = newSystem;
    this.systemManuallySelected = true;
    this.valueChange();
  }

  private _bits: number = 0;

  get bits() {
    return this._bits;
  }
  set bits(newSystem: number) {
    this._bits = newSystem;
    this.bitsManuallySelected = true;
    this.valueChange();
  }

  constructor(private conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.binarySystems;
    this.bitsArray = conversions.bitsArray;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - negative Numbers Representations: ' +
      "Signed magnitude, Ones' Complement, Two's Complement");
  }

  public valueChange() {
    const str = this.value.replace(/\s+/g, '').replace(/-/g, '');

    this.detectSystem(str);
    this.detectBitLength(str);

    let dec: BigInteger = bigInt(0);
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

    const maxVal = ConversionsService.pow2(this.bits - 1);
    const mask = ConversionsService.pow2(this.bits).minus(1);
    const negU1 = dec.not().and(mask);
    const negU2 = negU1.add(1);

    // Z-M
    try {
      this.calculateSignAndMagnitude(dec, maxVal);

    } catch (e) {
      this.results[0].error = e;
    }

    // U1
    try {
      this.calculateOnesComplement(dec, maxVal, negU1);

    } catch (e) {
      this.results[1].error = e;
    }

    // U2
    try {
      this.calculateTwosComplement(dec, maxVal, negU2);

    } catch (e) {
      this.results[2].error = e;
    }
  }

  private detectSystem(str: string) {
    if (!this.systemManuallySelected) {
      if (this.value.length === 0) {
        this.system = 0;
      } else {
        this.system = this.conversions.detectSystem(str, true);
      }
    }
  }

  private detectBitLength(str: string) {
    if (!this.bitsManuallySelected) {
      if (this.value.length === 0) {
        this.bits = 0;
      } else {
        this.bits = this.conversions.detectBitLength(str, this.systems[this.system].nr, true);
      }
    }
  }

  private calculateSignAndMagnitude(dec: BigInteger, maxVal: BigInteger) {
    if (dec.compareAbs(maxVal) === -1) { // dec < maxVal
      const zmVal = dec.add(maxVal); // 2^8, 2^16 ...

      this.results[0].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = zmVal.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        this.results[0].data[i] = str.toUpperCase();
      }

      this.results[0].error = null;

    } else {
      this.results[0].error = 'Bit amount not big enough.';
    }
  }

  private calculateOnesComplement(dec: BigInteger, maxVal: BigInteger, neg: BigInteger) {
    if (dec.compareAbs(maxVal) === -1) {
      this.results[1].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        this.results[1].data[i] = str.toUpperCase();
      }

      this.results[1].error = null;

    } else {
      this.results[1].error = 'Bit amount not big enough.';
    }
  }

  private calculateTwosComplement(dec: BigInteger, maxVal: BigInteger, neg: BigInteger) {
    if (dec.compareAbs(maxVal.add(1)) === -1) {
      this.results[2].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = ConversionsService.fillBitsToFullBytesWithZeros(str, this.systems[i].nr, this.bits);
        str = ConversionsService.format(str, this.systems[i].nr);

        this.results[2].data[i] = str.toUpperCase();
      }

      this.results[2].error = null;

    } else {
      this.results[2].error = 'Bit amount not big enough.';
    }
  }
}
