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

  public value: string = '';
  public system: number = 0;
  public systemManuallySelected: boolean = false;
  public detectedSystem: number = 0;

  public systems = [];

  public results = [];
  public error: string = null;

  public tags = [
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

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - number base conversions, ' +
      'binary to decimal, hexadecimal, octal numerals');
  }

  public systemSelected() {
    this.systemManuallySelected = true;
    this.valueChange();
  };

  public valueChange() {
    this.value = this.value.trim();

    if (!this.systemManuallySelected) {
      this.detectedSystem = this.conversions.detectSystem(this.value, true);
      this.system = this.detectedSystem;
    }

    if (this.systemManuallySelected) {
      if (!this.conversions.validateSystem(this.value, this.systems[this.system].nr)) {
        this.error = 'Incorrect value for that number system.';
        return false;
      }
    }

    this.error = null;
    try {
      let num = bigInt(this.value, this.systems[this.system].nr);
      if (isNaN(num.valueOf())) {
        this.error = 'Incorrect value for that number system.';
        return false;
      }

      this.results = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = num.toString(this.systems[i].nr);
        this.results[i] = this.conversions.format(str, this.systems[i].nr);
      }
    } catch (e) {
      this.error = e;
    }
  }
}
