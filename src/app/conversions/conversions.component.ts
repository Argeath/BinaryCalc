import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
let bigInt = require('big-integer');

@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.scss']
})
export class ConversionsComponent implements OnInit {

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

  systemManuallySelected: boolean = false;
  detectedSystem: number = 0;

  systems = [];

  results = [];
  error: string = null;

  tags = [
    'number system',
    'numeral system',
    'binary',
    'decimal',
    'octal',
    'hexadecimal',
    'hex',
    'bin to hex',
    'bin 2 hex',
    'hex to bin',
    'dec to bin',
    'bin to dec',
    'number representation',
    'digits',
    'number base',
    'numeral base',
    'radix',
    'notation',
    'base-2',
    'base-8',
    'base-10',
    'base-16',
    'conversion',
    'binary convert',
    'decimal conversion',
    'hexadecimal converter',
    'any base converter',
    'binary calculator'
  ];

  constructor(private conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
  }

  ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - number base conversions, ' +
      'binary to decimal, hexadecimal, octal numerals');
  }

  valueChange() {
    this.detectSystem();

    if(!this.validate())
      return;

    try {
      this.calculate();

    } catch (e) {
      this.error = e;
    }
  }

  private detectSystem() {
    if (!this.systemManuallySelected) {
      this.detectedSystem = this.conversions.detectSystem(this.value, true);
      this._system = this.detectedSystem;
    }
  }

  private validate(): boolean {
    if (!this.conversions.validateSystem(this.value, this.systems[this.system].nr)) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    this.error = null;
    return true;
  }

  private calculate() {
    const num = bigInt(this.value, this.systems[this.system].nr);

    if (isNaN(num.valueOf())) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    this.results = [];
    for (let i = 0; i < this.systems.length; i++) {
      let str = num.toString(this.systems[i].nr);
      this.results[i] = this.conversions.format(str, this.systems[i].nr);
    }
  }
}
