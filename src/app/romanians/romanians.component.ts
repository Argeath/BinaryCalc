import {Component, OnInit} from '@angular/core';
import {ConversionsService} from "../services/conversions.service";
import {MetaDataService} from "../services/meta-data.service";
let bigInt = require("big-integer");

@Component({
  selector: 'app-romanians',
  templateUrl: './romanians.component.html',
  styleUrls: ['./romanians.component.scss']
})
export class RomaniansComponent implements OnInit {

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
    this.systemManuallySelected = this.system != -1;
    this.valueChange();
  }

  systemManuallySelected: boolean = false;
  detectedNumeral: number = -1;

  systems = [];

  result: string = '';
  error: string = null;

  tags = [
    'romanian',
    'romanian to arabic',
    'arabic to romanian',
    'arabic converter',
    'romanian converter',
    'roman numerals',
    'romanian numerals',
    'romanian calculator'
  ];

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.numerals;
  }

  public ngOnInit(): void {
    this.meta.title$.next("Binary Calculator - Romanian numerals to Arabic converter");
  }

  valueChange() {
    this.detectSystem();

    this.error = this.validate();

    if (this.error)
      return false;

    if (this.system === 0)
      this.result = this.conversions.toRoman(bigInt(this.value));
    else
      this.result = this.conversions.fromRoman(this.value)+"";
  }

  private detectSystem() {
    if (!this.systemManuallySelected) {
      this.detectedNumeral = this.conversions.detectNumeral(this.value);
      this._system = this.detectedNumeral;
    }
  }

  private validate(): string {
    if (this.system === 0) {
      try {
        const num = bigInt(this.value);

        if (isNaN(num.value)) {
          return "Incorrect value for that number system.";
        }

        if (num < 1)
          return "Smallest number in Roman is 1.";
        if (num > 3999)
          return "Largest number in Roman is 3999.";

      } catch (e) {
        return e;
      }
    }

    return null;
  }
}
