import {Component, OnInit} from '@angular/core';
import {ConversionsService} from '../conversions.service';
import {MetaDataService} from "../meta-data.service";
let bigInt = require('big-integer');

@Component({
  selector: 'app-arithmetics',
  templateUrl: './arithmetics.component.html',
  styleUrls: ['./arithmetics.component.sass']
})
export class ArithmeticsComponent implements OnInit {

  value = ['', ''];
  system = [0, 0];
  systemManuallySelected = [false, false];
  detectedSystem = [0, 0];
  operation: string = '';

  systems = [];

  results = [];
  error: string = null;

  tags = [
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

  ngOnInit(): void {
    this.meta.title$.next("Binary Calculator - arithmetic operations: Addition, Subtraction, Modulus, Division on any base");
  }

  systemSelected(newValue: number, num: number) {
    this.system[num] = newValue;
    this.systemManuallySelected[num] = true;
    this.valueChange(num);
  };

  operationSelected(newValue: string) {
    this.operation = newValue;
    this.valueChange();
  };

  valueChange(index?: number) {
    if(index !== null && index !== undefined) {
      this.value[index] = this.value[index].trim();

      if (!this.systemManuallySelected[index]) {
        this.detectedSystem[index] = this.conversions.detectSystem(this.value[index], true);
        this.system[index] = this.detectedSystem[index];
      }

      if(this.systemManuallySelected) {
        if(!this.conversions.validateSystem(this.value[index], this.systems[this.system[index]].nr)) {
          this.error = "Incorrect value for that number system.";
          return false;
        }
      }

      if(this.value[index] == "NaN") {
        this.error = "Error";
        return false;
      }

      this.error = null;
    }

    try {
      let num1 = bigInt(this.value[0], this.systems[this.system[0]].nr);
      const num2 = bigInt(this.value[1], this.systems[this.system[1]].nr);

      if(isNaN(num1.value) || isNaN(num2.value)) {
        this.error = "Incorrect value for that number system.";
        return false;
      }

      switch(this.operation) {
        case 'add':
          num1 = num1.add(num2);
          break;
        case 'sub':
          num1 = num1.minus(num2);
          break;
        case 'mul':
          num1 = num1.multiply(num2);
          break;
        case 'div':
          num1 = num1.divide(num2);
          break;
        case 'mod':
          num1 = num1.mod(num2);
          break;
      }

      this.results = [];
      for(let i = 0; i < this.systems.length; i++) {
        let str = num1.toString(this.systems[i].nr);
        str = this.conversions.format(str, this.systems[i].nr);
        this.results[i] = str.toUpperCase();
      }
    } catch(e) {
      this.error = e;
    }
  }
}
