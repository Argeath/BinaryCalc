import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
import * as bigInt from 'big-integer';
import { Operation } from '../operation-select/operation';
import { Angulartics2 } from 'angulartics2';
import throttle from 'lodash/throttle';

@Component({
  selector: 'app-binaries',
  templateUrl: './binaries.component.html',
  styleUrls: ['./binaries.component.scss']
})
export class BinariesComponent implements OnInit {

  public value: string[] = ['', ''];
  public system = [0, 0];
  public systemManuallySelected = [false, false];

  public operations: Operation[] = [
    {
      name: '& (AND)',
      calculate: (num1, num2) => num1.and(num2)
    },
    {
      name: '| (OR)',
      calculate: (num1, num2) => num1.or(num2)
    },
    {
      name: '^ (XOR)',
      calculate: (num1, num2) => num1.xor(num2)
    }
  ];

  public systems = [];

  public results = [];
  public error: string = null;

  public tags = [
    'binary calculator',
    'binary operations',
    'binary AND',
    'binary OR',
    'binary XOR',
    'hex AND',
    'bin AND',
    'hex OR',
    'bin OR',
    'octal AND',
    'octal OR',
    'hex XOR',
    'hexadecimal operations'
  ];

  private _operation: Operation = null;

  get operation() {
    return this._operation;
  }

  set operation(newValue: Operation) {
    this._operation = newValue;
    this.valueChange();
  }

  constructor(private conversions: ConversionsService, private meta: MetaDataService, private ga: Angulartics2) {
    this.systems = conversions.binarySystems;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - binary operations: AND, OR on any base');
  }

  public systemSelected(index: number) {
    this.systemManuallySelected[index] = true;
    this.valueChange(index);


    this.ga.eventTrack.next({
      action: 'select system',
      properties: {
        category: 'binaries',
        label: `(${this.system[0]}), (${this.system[1]})`
      }
    });
  }

  public valueChange(index?: number) {
    return throttle(() => {
      if (index !== null && index !== undefined) {
        this.value[index] = this.value[index].trim();

        this.detectSystem(index);

        if (!this.validate(index)) {
          return;
        }
      }

      try {
        this.calculate();

        this.ga.eventTrack.next({
          action: 'calculate',
          properties: {
            category: 'binaries',
            label: `${this.value[0]} (${this.system[0]}), ${this.value[1]} (${this.system[1]})`
          }
        });
      } catch (e) {
        this.error = e;
      }
    }, 1000)();
  }

  private detectSystem(index: number) {
    if (!this.systemManuallySelected[index]) {
      const found = this.conversions.detectSystem(this.value[index], true);
      if (found) {
        this.system[index] = found;
      }
    }
  }

  private validate(index: number) {
    if (!ConversionsService.validateSystem(this.value[index],
        this.systems[this.system[index]].nr)) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    if (this.value[index] === 'NaN') {
      this.error = 'Error';
      return false;
    }

    this.error = null;
    return true;
  }

  private calculate() {
    let num1: bigInt.BigInteger = bigInt(this.value[0], this.systems[this.system[0]].nr);
    const num2: bigInt.BigInteger = bigInt(this.value[1], this.systems[this.system[1]].nr);

    if (isNaN(num1.valueOf()) || isNaN(num2.valueOf())) {
      this.error = 'Incorrect value for that number system.';
      return false;
    }

    if (this.operation) {
      num1 = this.operation.calculate(num1, num2);
    }

    this.results = [];
    for (let i = 0; i < this.systems.length; i++) {
      let str = num1.toString(this.systems[i].nr);
      str = ConversionsService.format(str, this.systems[i].nr);
      this.results[i] = str.toUpperCase();
    }
  }
}
