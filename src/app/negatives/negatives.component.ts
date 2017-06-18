import {Component, OnInit} from '@angular/core';
import {ConversionsService} from "../services/conversions.service";
import {MetaDataService} from "../services/meta-data.service";
const bigInt = require("big-integer");

@Component({
  selector: 'app-negatives',
  templateUrl: './negatives.component.html',
  styleUrls: ['./negatives.component.scss']
})
export class NegativesComponent implements OnInit {

  public value: string = '';
  public decValue: string = '';
  public bits: number = 0;
  public system: number = 0;
  public systemManuallySelected: boolean = false;
  public bitsManuallySelected: boolean = false;
  public detectedSystem: number = 0;

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

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
    this.bitsArray = conversions.bitsArray;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - negative Numbers Representations: ' +
      "Signed magnitude, Ones' Complement, Two's Complement");
  }

  public bitsSelected() {
    this.bitsManuallySelected = this.bits !== 0;
    this.valueChange();
  }

  public systemSelected() {
    this.systemManuallySelected = this.system !== 0;
    this.valueChange();
  };

  public valueChange() {
    this.value = this.value.trim();
    const str = this.value.replace(/\s+/g, '').replace(/-/g, '');

    this.detectSystem(str);
    this.detectBits(str);

    let dec = bigInt(0);

    try {
      dec = bigInt(str, this.systems[this.system].nr);

      if (isNaN(dec.valueOf())) {
        this.error = 'Incorrect value for that number system.';
        return false;
      }

      this.error = null;
      this.decValue = dec.toString(10);

    } catch (e) {
      this.error = e;
      return false;
    }

    const maxVal = this.conversions.pow2(this.bits - 1);

    // Z-M
    try {
      this.calculateSignAndMagnitude(dec, maxVal);
    } catch (e) {
      this.results[0].error = e;
    }

    let mask = this.conversions.pow2(this.bits).minus(1);

    // U1
    let neg = dec.not().and(mask);
    try {
      this.calculateOnesComplement(dec, maxVal, neg);
    } catch (e) {
      this.results[1].error = e;
    }

    // U2
    neg = neg.add(1);
    try {
      this.calculateTwosComplement(dec, maxVal, neg);
    } catch (e) {
      this.results[2].error = e;
    }
  }

  private detectSystem(str) {
    if (!this.systemManuallySelected) {
      if (this.value.length === 0)
        this.system = 0;
      else {
        this.detectedSystem = this.conversions.detectSystem(str, true);
        this.system = this.detectedSystem;
      }
    }
  }

  private detectBits(str) {
    if (!this.bitsManuallySelected) {
      if (this.value.length === 0)
        this.bits = 0;
      else {
        this.bits = this.conversions.detectBits(str, this.systems[this.system].nr, true);
      }
    }
  }

  private calculateSignAndMagnitude(dec, maxVal) {
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
    } else {
      this.results[0].error = 'Bit amount not big enough.';
    }
  }

  private calculateOnesComplement(dec, maxVal, neg) {
    if (dec.compareAbs(maxVal) === -1) {
      this.results[1].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = neg.toString(this.systems[i].nr);
        str = this.conversions.fillWithZeros(str, this.systems[i].nr, this.bits);
        str = this.conversions.format(str, this.systems[i].nr);
        this.results[1].data[i] = str.toUpperCase();
      }
      this.results[1].error = null;
    } else {
      this.results[1].error = 'Bit amount not big enough.';
    }
  }

  private calculateTwosComplement(dec, maxVal, neg) {
    if (dec.compareAbs(maxVal + 1) === -1) {
      this.results[2].data = [];
      for (let i = 0; i < this.systems.length; i++) {
        let strr = neg.toString(this.systems[i].nr);
        strr = this.conversions.fillWithZeros(strr, this.systems[i].nr, this.bits);
        strr = this.conversions.format(strr, this.systems[i].nr);
        this.results[2].data[i] = strr.toUpperCase();
      }
      this.results[2].error = null;
    } else {
      this.results[2].error = 'Bit amount not big enough.';
    }
  }
}
