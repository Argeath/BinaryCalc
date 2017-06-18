import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { MetaDataService } from '../services/meta-data.service';
var bigInt = require('big-integer');

@Component({
  selector: 'app-arithmetics',
  templateUrl: './arithmetics.component.html',
  styleUrls: ['./arithmetics.component.scss']
})
export class ArithmeticsComponent implements OnInit {

  public value = ['', ''];
  public system = [0, 0];
  public systemManuallySelected = [false, false];
  public detectedSystem = [0, 0];
  public operation = null;

  public operations = [
    {
      name: '+ (addition)',
      calculate: (num1, num2) => num1.add(num2)
    },
    {
      name: '- (subtraction)',
      calculate: (num1, num2) => num1.minus(num2)
    },
    {
      name: '* (multiplication)',
      calculate: (num1, num2) => num1.multiply(num2)
    },
    {
      name: '/ (division)',
      calculate: (num1, num2) => num1.divide(num2)
    },
    {
      name: '% (modulus)',
      calculate: (num1, num2) => num1.mod(num2)
    }
  ];
  public systems = [];

  public results = [];
  public error: string = null;

  public tags = [
    'binary calculator',
    'arithmetic',
    'addition',
    'binary addition',
    'subtraction',
    'binary subtraction',
    'binary modulus',
    'binary division',
    'hex addition',
    'hex modulus',
    'hex division',
    'binary arithmetic',
    'hex arithmetic',
    'conversions'
  ];

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
    this.systems = conversions.systems;
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - arithmetic operations: ' +
      'Addition, Subtraction, Modulus, Division on any base');
  }

  public systemSelected(newValue: number, num: number) {
    this.system[num] = newValue;
    this.systemManuallySelected[num] = true;
    this.valueChange(num);
  };

  public operationSelected(newValue) {
    this.operation = newValue;
    this.valueChange();
  };

  public valueChange(index?: number) {
    if (index !== null && index !== undefined) {
      this.value[index] = this.value[index].trim();

      if (!this.systemManuallySelected[index]) {
        this.detectedSystem[index] = this.conversions.detectSystem(this.value[index], true);
        this.system[index] = this.detectedSystem[index];
      }

      if (this.systemManuallySelected) {
        if (!this.conversions.validateSystem(this.value[index],
                this.systems[this.system[index]].nr)) {
          this.error = 'Incorrect value for that number system.';
          return false;
        }
      }

      if (this.value[index] === 'NaN') {
        this.error = 'Error';
        return false;
      }

      this.error = null;
    }

    try {
      let num1 = bigInt(this.value[0], this.systems[this.system[0]].nr);
      const num2 = bigInt(this.value[1], this.systems[this.system[1]].nr);

      if (isNaN(num1.valueOf()) || isNaN(num2.valueOf())) {
        this.error = 'Incorrect value for that number system.';
        return false;
      }

      if(this.operation) {
        num1 = this.operation.calculate(num1, num2);
      }

      this.results = [];
      for (let i = 0; i < this.systems.length; i++) {
        let str = num1.toString(this.systems[i].nr);
        str = this.conversions.format(str, this.systems[i].nr);
        this.results[i] = str.toUpperCase();
      }
    } catch (e) {
      this.error = e;
    }
  }
}
