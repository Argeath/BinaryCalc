import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer';

export enum NumeralSystems {
  ARABIC, ROMAN
}

export enum BinarySystems {
  BINARY, OCTAL, DECIMAL, HEXADECIMAL
}

export interface System {
  name: string;
}

export interface BinarySystem extends System {
  nr: number;
  system: BinarySystems;
  skipDetection: boolean;
}

@Injectable()
export class ConversionsService {

  public static detectNumeralSystem(v: string): NumeralSystems {
    v = v.toUpperCase();

    let i = v.length;
    let dec = true;

    while (i--) {
      const cnr = v.charCodeAt(i);
      if (cnr < 48 || cnr > 57) {
        dec = false;
        break;
      }
    }

    return dec ? NumeralSystems.ARABIC : NumeralSystems.ROMAN; // 0 - arabic, 1 - roman
  }

  public static getHighestNumeral(v: string) {
    v = v.toUpperCase();

    let i = v.length;
    let max = 0;

    while (i--) {
      const cnr = ConversionsService.ASCIIToHexNumber(v.charCodeAt(i));
      if (cnr > max) {
        max = cnr;
      }
    }

    return max;
  }

  public static format(s: string, base: number) {
    let split = 4;

    if (base > 2 && base <= 10) {
      split = 3;
    } else if (base > 10) {
      split = 2;
    }

    const len = s.length;

    if (s === 'NaN' || s === '<NaN>') {
      return s;
    }

    if (len < split) {
      return s;
    }

    for (let i = len - split; i > 0; i -= split) {
      s = s.slice(0, i) + ' ' + s.slice(i);
    }

    return s;
  }

  public static ASCIIToHexNumber(c: number): number {
    if (c === 32) { // skip space
      return 0;
    } else if (c >= 48 && c <= 57) { // >= '0' && <= '9'
      return c - 48; // - '0'
    } else if (c >= 65 && c <= 90) { // >= 'A' && <= 'Z'
      return c - 55; // A = 10
    }

    return NaN;
  }

  public static parseAnyBaseToDec(str: string, base: number): number {
    if (str.length === 0) {
      return 0;
    }

    return parseInt(str, base);
  }

  public static fillBitsToFullBytesWithZeros(str: string, base: number, bits: number): string {
    let remaining = 0;

    if (base === 2) {
      remaining = bits - str.length;
    } else if (base === 16) {
      remaining = bits / 4 - str.length;
    }

    if (remaining <= 0) {
      return str;
    }

    return '0'.repeat(remaining) + str;
  }

  public static fromArabicToRoman(num: number): string {
    let roman = '';

    for (const i in ConversionsService.ROMAN_TABLE) {
      if (ConversionsService.ROMAN_TABLE.hasOwnProperty(i)) {
        while (num >= ConversionsService.ROMAN_TABLE[i]) {
          roman += i;
          num -= ConversionsService.ROMAN_TABLE[i];
        }
      }
    }

    return roman;
  }

  public static fromRomanToArabic(str: string): number {
    let result = 0;

    for (const i in ConversionsService.ROMAN_TABLE) {
      if (ConversionsService.ROMAN_TABLE.hasOwnProperty(i)) {
        while (str.indexOf(i) === 0) {
          result += ConversionsService.ROMAN_TABLE[i];
          str = str.replace(i, '');
        }
      }
    }

    return result;
  }

  public static validateSystem(str: string, base: number): boolean {
    const len = str.length;

    for (let i = 0; i < len; i++) {
      const cnr = ConversionsService.ASCIIToHexNumber(str.charCodeAt(i));
      if (cnr >= base) {
        return false;
      }
    }

    return true;
  }

  public static pow2(exp: number): bigInt.BigInteger {
    const two: bigInt.BigInteger = bigInt(2);
    return two.shiftLeft(exp - 1);
  }

  private static ROMAN_TABLE = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};

  public bitsArray = [4, 8, 16, 32, 64];

  public binarySystems: BinarySystem[] = [
    {
      nr: 2,
      system: BinarySystems.BINARY,
      name: 'binary',
      skipDetection: false
    },
    {
      nr: 8,
      system: BinarySystems.OCTAL,
      name: 'octal',
      skipDetection: true
    },
    {
      nr: 10,
      system: BinarySystems.DECIMAL,
      name: 'decimal',
      skipDetection: false
    },
    {
      nr: 16,
      system: BinarySystems.HEXADECIMAL,
      name: 'hexadecimal',
      skipDetection: false
    }
  ];

  public numeralSystems: System[] = [
    {
      name: 'Arabic'
    },
    {
      name: 'Roman'
    }
  ];

  public detectSystem(v: string, pushToHigher?: boolean): BinarySystems {
    const max = ConversionsService.getHighestNumeral(v);

    if (!pushToHigher) {
      return max;
    }

    const found = this.binarySystems.find((s) => !s.skipDetection && s.nr > max);

    return found && found.system;
  }

  public detectBitLength(num: number, pushToHigher?: boolean): number {
    const bits = Math.ceil(Math.log2(num));

    if (!pushToHigher) {
      return bits;
    }

    const pushed = this.bitsArray.find((b) => bits <= b);
    return pushed ? pushed : bits;
  }

  public detectBitLengthForNegative(v: string, base: number, pushToHigher?: boolean): number {
    const str = v.replace(/\s+/g, '').replace(/-/g, ''); // Remove spaces and dashes
    const dec = ConversionsService.parseAnyBaseToDec(str, base) * 2 + 1;

    return this.detectBitLength(dec, pushToHigher); // max value for negatives
  }
}
