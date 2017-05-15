import {Component, OnInit} from '@angular/core';
import {ConversionsService} from "../conversions.service";
import {MetaDataService} from "../meta-data.service";
let bigInt = require("big-integer");

@Component({
  selector: 'app-negatives',
  templateUrl: './negatives.component.html',
  styleUrls: ['./negatives.component.sass']
})
export class NegativesComponent implements OnInit {

  value: string = '';
  decValue: string = '';
  bits: number = 0;
  system: number = 0;
  systemManuallySelected: boolean = false;
  bitsManuallySelected: boolean = false;
  detectedSystem: number = 0;

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

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
    this.bitsArray = conversions.bitsArray;
  }

  ngOnInit(): void {
    this.meta.title$.next("Binary Calculator - negative Numbers Representations: Signed magnitude, Ones' Complement, Two's Complement");
  }

  bitsSelected(newValue: number) {
    this.bits = newValue;
    this.bitsManuallySelected = this.bits != 0;
    this.valueChange();
  }

  systemSelected(newValue: number) {
    this.system = newValue;
    this.systemManuallySelected = this.system != 0;
    this.valueChange();
  };

  valueChange() {
    this.value = this.value.trim();
    const str = this.value.replace(/\s+/g, '').replace(/-/g, '');

    if(!this.systemManuallySelected) {
      if(this.value.length == 0)
        this.system = 0;
      else {
        this.detectedSystem = this.conversions.detectSystem(str, true);
        this.system = this.detectedSystem;
      }
    }

    if(!this.bitsManuallySelected) {
      if(this.value.length == 0)
        this.bits = 0;
      else {
        this.bits = this.conversions.detectBits(str, this.systems[this.system].nr, true);
      }
    }

    let dec = null;
    try {
      dec = bigInt(str, this.systems[this.system].nr);

      if(isNaN(dec.value)) {
        this.error = 'Incorrect value for that number system.';
        return false;
      }

      this.error = null;
      this.decValue = dec.toString(10);
    } catch(e) {
      this.error = e;
      return false;
    }

    const maxVal = this.conversions.pow2(this.bits - 1);

    // Z-M
    try {
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
    } catch(e) {
      this.results[0].error = e;
    }


    let mask = this.conversions.pow2(this.bits).minus(1);

    // U1
    let neg = dec.not().and(mask);
    try {
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
    } catch(e) {
      this.results[1].error = e;
    }

    // U2
    neg = neg.add(1);
    try {
      if (dec.compareAbs(maxVal+1) === -1) {
        this.results[2].data = [];
        for (let i = 0; i < this.systems.length; i++) {
          let str = neg.toString(this.systems[i].nr);
          str = this.conversions.fillWithZeros(str, this.systems[i].nr, this.bits);
          str = this.conversions.format(str, this.systems[i].nr);
          this.results[2].data[i] = str.toUpperCase();
        }
        this.results[2].error = null;
      } else {
        this.results[2].error = 'Bit amount not big enough.';
      }
    } catch(e) {
      this.results[2].error = e;
    }
  }
}
