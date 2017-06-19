import {Component, OnInit} from '@angular/core';
import {ConversionsService} from "../services/conversions.service";
import {MetaDataService} from "../services/meta-data.service";
import { BigInteger } from 'big-integer';
const bigInt = require("big-integer");

@Component({
  selector: 'app-negatives',
  templateUrl: './negatives.component.html',
  styleUrls: ['./negatives.component.scss']
})
export class NegativesComponent implements OnInit {

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

  systemManuallySelected: boolean = false;
  bitsManuallySelected: boolean = false;
  private detectedSystem: number = 0;

  bitsArray = [];
  systems = [];
  error: string = null;

  results = [
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

  tags = [
    'binary calculator',
    'negative numbers',
    'negative numerals',
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

  constructor(private conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
    this.bitsArray = conversions.bitsArray;
  }

  ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - negative Numbers Representations: ' +
      "Signed magnitude, Ones' Complement, Two's Complement");
  }

  valueChange() {
    const str = this.value.replace(/\s+/g, '').replace(/-/g, '');

    this.detectSystem(str);
    this.detectBits(str);

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

    const maxVal = this.conversions.pow2(this.bits - 1);
    const mask = this.conversions.pow2(this.bits).minus(1);
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
      if (this.value.length === 0)
        this.system = 0;
      else {
        this.detectedSystem = this.conversions.detectSystem(str, true);
        this.system = this.detectedSystem;
      }
    }
  }

  private detectBits(str: string) {
    if (!this.bitsManuallySelected) {
      if (this.value.length === 0)
        this.bits = 0;
      else
        this.bits = this.conversions.detectBits(str, this.systems[this.system].nr, true);
    }
  }

  private calculateSignAndMagnitude(dec: BigInteger, maxVal: BigInteger) {
    if (dec.compareAbs(maxVal) === -1) { // dec < maxVal
      let zmVal = dec.add(maxVal); // 2^8, 2^16 ...

      this.results[0].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = zmVal.toString(this.systems[i].nr);
        str = this.conversions.fillWithZeros(str, this.systems[i].nr, this.bits);
        str = this.conversions.format(str, this.systems[i].nr);

        this.results[0].data[i] = str.toUpperCase();
      }

      this.results[0].error = null;

    } else
      this.results[0].error = 'Bit amount not big enough.';
  }

  private calculateOnesComplement(dec: BigInteger, maxVal: BigInteger, neg: BigInteger) {
    if (dec.compareAbs(maxVal) === -1) {
      this.results[1].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = this.conversions.fillWithZeros(str, this.systems[i].nr, this.bits);
        str = this.conversions.format(str, this.systems[i].nr);

        this.results[1].data[i] = str.toUpperCase();
      }

      this.results[1].error = null;

    } else
      this.results[1].error = 'Bit amount not big enough.';
  }

  private calculateTwosComplement(dec: BigInteger, maxVal: BigInteger, neg: BigInteger) {
    if (dec.compareAbs(maxVal.add(1)) === -1) {
      this.results[2].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = this.conversions.fillWithZeros(str, this.systems[i].nr, this.bits);
        str = this.conversions.format(str, this.systems[i].nr);

        this.results[2].data[i] = str.toUpperCase();
      }

      this.results[2].error = null;

    } else
      this.results[2].error = 'Bit amount not big enough.';
  }
}
