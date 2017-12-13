import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import * as bigInt from 'big-integer';
import { Angulartics2 } from 'angulartics2';
import throttle from 'lodash/throttle';

@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.scss']
})
export class ConversionsComponent implements OnInit {

  public systemManuallySelected = false;

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

  private _value = '';

  get value() {
    return this._value;
  }
  set value(newValue: string) {
    if (this._value !== newValue) {
      this._value = newValue.trim();
      this.valueChange();
    }
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

  constructor(private conversions: ConversionsService, private meta: MetaDataService, private ga: Angulartics2) {
    this.systems = conversions.binarySystems;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - number base conversions, ' +
      'binary to decimal, hexadecimal, octal numeralSystems');
  }

  public systemSelected() {
    this.systemManuallySelected = true;

    this.ga.eventTrack.next({
      action: 'select system',
      properties: {
        category: 'conversions',
        label: this.system
      }
    });
  }

  public valueChange() {
    return throttle(() => {
      this.detectSystem();

      if (!this.validate()) {
        return;
      }

      try {
        this.calculate();

        this.ga.eventTrack.next({
          action: 'calculate',
          properties: {
            category: 'conversions',
            label: this.value,
            system: this.system
          }
        });
      } catch (e) {
        this.error = e;
      }
    }, 1000)();
  }

  private detectSystem() {
    if (!this.systemManuallySelected) {
      const found = this.conversions.detectSystem(this.value, true);
      if (found) {
        this.system = found;
      }
    }
  }

  private validate(): boolean {
    if (!ConversionsService.validateSystem(this.value, this.systems[this.system].nr)) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    this.error = null;
    return true;
  }

  private calculate() {
    const num: bigInt.BigInteger = bigInt(this.value, this.systems[this.system].nr);

    if (isNaN(num.valueOf())) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    this.results = [];
    let str;

    for (let i = 0; i < this.systems.length; i++) {
      str = num.toString(this.systems[i].nr);
      this.results[i] = ConversionsService.format(str, this.systems[i].nr);
    }
  }
}
