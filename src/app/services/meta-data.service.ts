import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class MetaDataService {
  public title$: BehaviorSubject<string> = new BehaviorSubject("Binary Calculator - Numeral base conversions, Decimal, Hexadecimal, RGB, CMYK, HSL");

}
