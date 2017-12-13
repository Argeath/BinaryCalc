import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import * as bigInt from 'big-integer';

@Component({
  selector: 'app-romanians',
  templateUrl: './romanians.component.html',
  styleUrls: ['./romanians.component.scss']
})
export class RomaniansComponent implements OnInit {

  public systemManuallySelected = false;
  public detectedNumeral = -1;

  public systems = [];

  public result = '';
  public error: string = null;

  public tags = [
    'romanian',
    'romanian to arabic',
    'arabic to romanian',
    'arabic converter',
    'romanian converter',
    'roman numeralSystems',
    'romanian numeralSystems',
    'romanian calculator'
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
    this._system = newSystem;
    this.systemManuallySelected = this.system !== -1;
    this.valueChange();
  }

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.numeralSystems;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - Romanian numeralSystems to Arabic converter');
  }

  public valueChange() {
    this.detectSystem();

    this.error = this.validate();

    if (this.error) {
      return false;
    }

    if (this.system === 0) {
      this.result = ConversionsService.fromArabicToRoman(bigInt(this.value).valueOf());
    } else {
      this.result = ConversionsService.fromRomanToArabic(this.value) + '';
    }
  }

  private detectSystem() {
    if (!this.systemManuallySelected) {
      this.detectedNumeral = ConversionsService.detectNumeralSystem(this.value);
      this._system = this.detectedNumeral;
    }
  }

  private validate(): string {
    if (this.system === 0) {
      try {
        const num = bigInt(this.value).valueOf();

        if (isNaN(num)) {
          return 'Incorrect value for that number system.';
        }

        if (num < 1) {
          return 'Smallest number in Roman is 1.';
        } else if (num > 3999) {
          return 'Largest number in Roman is 3999.';
        }

      } catch (e) {
        return e;
      }
    }

    return null;
  }
}
