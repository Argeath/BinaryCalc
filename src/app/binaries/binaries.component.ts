import {Component, OnInit} from "@angular/core";
import {ConversionsService} from "../services/conversions.service";
import {MetaDataService} from "../services/meta-data.service";
import {BigInteger} from "big-integer";
import {Operation} from "../operation-select/operation";
let bigInt = require('big-integer');

@Component({
  selector: 'app-binaries',
  templateUrl: './binaries.component.html',
  styleUrls: ['./binaries.component.scss']
})
export class BinariesComponent implements OnInit {

  value: string[] = ['', ''];
  system = [0, 0];
  systemManuallySelected = [false, false];
  detectedSystem = [0, 0];
  private _operation: Operation = null;

  get operation() {
    return this._operation;
  }

  set operation(newValue: Operation) {
    this._operation = newValue;
    this.valueChange();
  }

  operations: Operation[] = [
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

  systems = [];

  results = [];
  error: string = null;

  tags = [
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

  constructor(private conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
  }

  ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - binary operations: AND, OR on any base');
  }

  systemSelected(index: number) {
    this.systemManuallySelected[index] = true;
    this.valueChange(index);
  }

  valueChange(index?: number) {
    if (index !== null && index !== undefined) {
      this.value[index] = this.value[index].trim();

      this.detectSystem(index);

      if (!this.validate(index))
        return;
    }

    try {
      this.calculate();
    } catch (e) {
      this.error = e;
    }
  }

  private detectSystem(index: number) {
    if (!this.systemManuallySelected[index]) {
      this.detectedSystem[index] = this.conversions.detectSystem(this.value[index], true);
      this.system[index] = this.detectedSystem[index];
    }
  }

  private validate(index: number) {
    if (!this.conversions.validateSystem(this.value[index], this.systems[this.system[index]].nr)) {
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
    let num1: BigInteger = bigInt(this.value[0], this.systems[this.system[0]].nr);
    const num2: BigInteger = bigInt(this.value[1], this.systems[this.system[1]].nr);

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
      str = this.conversions.format(str, this.systems[i].nr);
      this.results[i] = str.toUpperCase();
    }
  }
}
