import { Injectable } from '@angular/core';
let bigInt = require("big-integer");

@Injectable()
export class ConversionsService {

  constructor() {}

  bitsArray = [4, 8, 16, 32, 64];

  systems = [
    {
      nr: 2,
      name: "binary",
      skipDetection: false
    },
    {
      nr: 8,
      name: "octal",
      skipDetection: true
    },
    {
      nr: 10,
      name: "decimal",
      skipDetection: false
    },
    {
      nr: 16,
      name: "hexadecimal",
      skipDetection: false
    }
  ];

  numerals = [
    {
      name: 'Arabic'
    },
    {
      name: 'Roman'
    }
  ];

  detectNumeral(v: string): number {
    v = v.toUpperCase();
    let i = v.length;
    let dec: boolean = true;
    while(i--) {
      let cnr = v.charCodeAt(i);
      if(cnr < 48 || cnr > 57) {
        dec = false;
        break;
      }
    }

    return dec ? 0 : 1; // 0 - arabic, 1 - roman
  }

  detectSystem(v: string, pushToHigher?: boolean): number {
    v = v.toUpperCase();
    let i = v.length;
    let max = 0;
    while (i--) {
      let cnr = this.charToNr(v.charCodeAt(i));
      if(cnr > max)
        max = cnr;
    }
    max++;

    if(pushToHigher) {
      let detected = 0;
      const len = this.systems.length;

      for(let i = 0; i < len; i++) {
        if(this.systems[i].skipDetection || this.systems[i].nr < max) continue;
        detected = i;
        break;
      }
      return detected;
    }

    return max;
  }

  detectBits(v: string, base: number, pushToHigher?: boolean): number {
    let str = v.replace(/\s+/g, '').replace(/-/g, '');
    let dec = this.convertToDec(str, base) * 2 + 1;
    let bits = Math.ceil(Math.log2(dec));

    if(pushToHigher) {
      let detected = 0;
      const len = this.bitsArray.length;

      for(let i = 0; i < len; i++) {
        if(this.bitsArray[i] < bits) continue;
        detected = this.bitsArray[i];
        break;
      }

      return detected;
    }
    return bits;
  }

  format(s, base: number) {
    let split = 4;
    if(base > 2 && base <= 10)
      split = 3;
    if(base > 10)
      split = 2;

    const len = s.length;

    if(s === 'NaN' || s === '<NaN>')
      return s;

    if(len < split)
      return s;

    for(let i = len - split; i > 0; i-= split) {
      s = s.slice(0, i) + ' ' + s.slice(i);
    }

    return s;
  }

  charToNr(c: number) {
    if(c == 32) // skip space
      return 0;
    if(c >= 48 && c <= 57) // >= '0' && <= '9'
      return c - 48; // - '0'
    if(c >= 65 && c <= 90) // >= 'A' && <= 'Z'
      return c - 55; // A = 10
    return NaN;
  }

  nrToChar(c: number): string {
    if(c >= 10) {
      return String.fromCharCode(55 + c);
    }
    return c+'';
  }

  convertToBase(number: number, toBase: number) {
    if(number == null)
      number = 0;

    const converted = [];

    while(number>=1) {
      converted.unshift(number%toBase);
      number = Math.floor(number/toBase);
    }

    if(converted.length == 0)
      converted.push(0);

    return converted;
  }

  convertToDec(str: string, base: number): number {
    if(str.length == 0)
      return 0;

    return parseInt(str, base);
  }

  fillWithZeros(str: string, base: number, bits: number) {
    let remaining = 0;
    if(base == 2) {
      remaining = bits - str.length;
    } else if(base == 16) {
      remaining = bits/4 - str.length;
    }

    for(let i = 0; i < remaining; i++) {
      str = '0' + str;
    }

    return str;
  }

  toRoman(num: number): string {
    const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '',
      i;
    for ( i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  fromRoman(str: string): number {
    let result = 0;
    // the result is now a number, not a string
    const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let i;
    for ( i in lookup ) {
      while (str.indexOf(i) === 0){
        result += lookup[i];
        str = str.replace(i,'');
      }
    }
    return result;
  }

  validateSystem(str: string, base: number): boolean {
    const len = str.length;

    for(let i = 0; i < len; i++) {
      const cnr = this.charToNr(str.charCodeAt(i));
      if(cnr >= base)
        return false;
    }

    return true;
  }

  pow2(exp: number) {
    return bigInt(2).shiftLeft(exp - 1);
  }
}
