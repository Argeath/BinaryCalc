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

  public value: string = '';
  system: number = 0;
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

  public systemSelected(newValue: number) {
    this.system = newValue;
    this.systemManuallySelected = this.system != -1;
    this.valueChange(this.value);
  }

  valueChange(newValue: string) {
    this.value = newValue.trim();

    if (!this.systemManuallySelected) {
      this.detectedNumeral = this.conversions.detectNumeral(this.value);
      this.system = this.detectedNumeral;
    }

    const error = this.validate();

    if (error) {
      this.error = error;
      return false;
    } else
      this.error = null;

    if (this.system === 0) {
      this.result = this.conversions.toRoman(bigInt(this.value));
    } else {
      this.result = this.conversions.fromRoman(this.value)+"";
    }
  }

  validate(): string {
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
  }
}
