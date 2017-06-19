import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { Color } from './color';
import { MetaDataService } from '../services/meta-data.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  private _value: string = '';

  get value() {
    return this._value;
  }
  set value(newValue: string) {
    this._value = newValue.trim();
    this.valueChange();
  }

  private _system: number = -1;

  get system() {
    return this._system;
  }
  set system(newSystem: number) {
    this._system = newSystem;
    this.systemManuallySelected = this.system !== -1;
    this.valueChange();
  }

  public systems = [
    {
      nr: null,
      name: 'Hex'
    },
    {
      nr: null,
      name: 'RGB'
    },
    {
      nr: null,
      name: 'HSL'
    },
    {
      nr: null,
      name: 'CMYK'
    }
  ];

  public detectedSystem: number = -1;
  public systemManuallySelected: boolean = false;
  public results = [];
  public error: string = null;

  public color: Color = null;

  public tags = [
    'color',
    'color palette',
    'RGB',
    'HEX color',
    'HSL',
    'Hex to RGB',
    'RGB to CMYK',
    'RGB to HSL',
    'CMYK to RGB',
    'color conversion',
    'color converter',
    'RGB converter',
    'CMYK conversion'
  ];

  constructor(public conversions: ConversionsService, private meta: MetaDataService) {
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - color conversions: ' +
      'RGB, hex, HSL, CMYK. Color palette');
  }

  public valueChange() {

    const value = this.value.replace(/\s+/g, '').replace(/-/g, '').toUpperCase();

    if (!this.systemManuallySelected) {
      this.detectedSystem = ColorsComponent.detectSystem(value);
      this._system = this.detectedSystem;
    }

    this.color = new Color();
    if (this.system === 0) { // Hex
      if(!this.validateHex(value))
        return;

      this.fromHex(value);

    } else if (this.system === 1) { // RGB
      this.fromRGB(value);

    } else if (this.system === 2) { // HSL
      this.fromHSL(value);

    } else if (this.system === 3) { // CMYK
      this.fromCMYK(value);
    }

    this.results[0] = this.color.printHex();
    this.results[1] = this.color.printRGB();
    this.results[2] = this.color.printHsl();
    this.results[3] = this.color.printCmyk();
  }

  private validateHex(value: string) {
    if (value.length !== 4 && value.length !== 7 && value.length !== 9) {
      this.error = 'Incorrect hex value\'s length.';
      return false;
    }

    if (!this.conversions.validateSystem(value, 16)) {
      this.error = 'Incorrect hex value';
      return false;
    }

    this.error = null;
    return true;
  }

  private fromHex(value: string) {
    let tmp = value;
    if (value.length === 4) {
      tmp = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
    }

    let r;
    let g;
    let b;
    r = parseInt(tmp.substr(1, 2), 16);
    g = parseInt(tmp.substr(3, 2), 16);
    b = parseInt(tmp.substr(5, 2), 16);
    this.color.fromRGB(r, g, b);
  }

  private fromRGB(value: string) {
    let tmp;
    let r;
    let g;
    let b;
    tmp = value.substr(3); // bez rgb
    tmp = tmp.replace(/(\(|\))/g, ''); // bez ( i )
    tmp = tmp.split(',');

    if (tmp.length !== 3) {
      // this.error = 'Invalid RGB';
      return false;
    }

    r = parseInt(tmp[0], 10);
    g = parseInt(tmp[1], 10);
    b = parseInt(tmp[2], 10);
    if (r < 0 || r > 255 || b < 0 || b > 255 || g < 0 || g > 255) {
      this.error = 'Color value can be from 0 to 255.';
      return false;
    }

    this.color.fromRGB(r, g, b);
  }

  private fromHSL(value: string) {
    let tmp;
    let h;
    let s;
    let l;
    tmp = value.substr(3); // bez hsl
    tmp = tmp.replace(/(\)|\(|%)/g, ''); // bez ( i ) i %
    tmp = tmp.split(',');

    if (tmp.length !== 3) {
      // this.error = 'Invalid HSL';
      return false;
    }

    h = parseInt(tmp[0], 10);
    s = parseInt(tmp[1], 10);
    l = parseInt(tmp[2], 10);

    this.color.fromHSL(h, s, l);
  }

  private fromCMYK(value: string) {
    let tmp;
    let c;
    let m;
    let y;
    let k;
    tmp = value.substr(4); // bez cmyk
    tmp = tmp.replace(/(\)|\(|%)/g, ''); // bez ( i ) i %
    tmp = tmp.split(',');

    if (tmp.length !== 4) {
      // this.error = 'Invalid HSL';
      return false;
    }

    c = parseInt(tmp[0], 10);
    m = parseInt(tmp[1], 10);
    y = parseInt(tmp[2], 10);
    k = parseInt(tmp[3], 10);

    this.color.fromCMYK(c, m, y, k);
  }

  public static detectSystem(v: string): number {
    v = v.trim().toLowerCase();

    if (v.charAt(0) === '#') {
      return 0;
    } else if (v.substr(0, 3) === 'rgb') {
      return 1;
    } else if (v.substr(0, 3) === 'hsl') {
      return 2;
    } else if (v.substr(0, 4) === 'cmyk') {
      return 3;
    }

    return -1;
  }
}
