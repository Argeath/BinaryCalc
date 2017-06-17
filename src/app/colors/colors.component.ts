import { Component, OnInit } from '@angular/core';
import { ConversionsService } from '../services/conversions.service';
import { Subject } from 'rxjs';
import { Color } from './color';
import { MetaDataService } from '../services/meta-data.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.sass']
})
export class ColorsComponent implements OnInit {

  public value: string = '';
  public valueChanged: Subject<string> = new Subject<string>();

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

  public system: number = -1;
  public detectedSystem: number = -1;
  public systemManuallySelected: boolean = false;
  public results = [];
  public error: string = null;

  public color: Color = null;
  public valid: boolean = false;

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
    this.valueChanged
      .debounceTime(500) // wait 300ms after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((model) => this.valueChange(model));
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - color conversions: ' +
      'RGB, hex, HSL, CMYK. Color palette');
  }

  public systemSelected(newValue: number) {
    this.system = newValue;
    this.systemManuallySelected = this.system !== -1;
    this.valueChange(this.value);
  }

  public OnValueChanged(text: string) {
    this.valueChanged.next(text);
  }

  public valueChange(v: string) {
    this.value = v;
    this.valid = false;
    this.error = null;
    const vl = this.value.replace(/\s+/g, '').replace(/-/g, '').toUpperCase();

    if (!this.systemManuallySelected) {
      this.detectedSystem = ColorsComponent.detectSystem(vl);
      this.system = this.detectedSystem;
    }

    this.color = new Color();
    if (this.system === 0) { // Hex
      if (vl.length !== 4 && vl.length !== 7 && vl.length !== 9) {
        this.error = 'Incorrect hex value\'s length.';
        return false;
      }

      if (!this.conversions.validateSystem(vl, 16)) {
        this.error = 'Incorrect hex value';
        return false;
      }

      let tmp = vl;
      if (vl.length === 4) {
        tmp = '#' + vl[1] + vl[1] + vl[2] + vl[2] + vl[3] + vl[3];
      }

      let r;
      let g;
      let b;
      r = parseInt(tmp.substr(1, 2), 16);
      g = parseInt(tmp.substr(3, 2), 16);
      b = parseInt(tmp.substr(5, 2), 16);
      this.color.fromRGB(r, g, b);

    } else if (this.system === 1) { // RGB
      let tmp;
      let r;
      let g;
      let b;
      tmp = vl.substr(3); // bez rgb
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
    } else if (this.system === 2) { // HSL
      let tmp;
      let h;
      let s;
      let l;
      tmp = vl.substr(3); // bez hsl
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
    } else if (this.system === 3) { // CMYK
      let tmp;
      let c;
      let m;
      let y;
      let k;
      tmp = vl.substr(4); // bez cmyk
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

    this.results[0] = this.color.printHex();
    this.results[1] = this.color.printRGB();
    this.results[2] = this.color.printHsl();
    this.results[3] = this.color.printCmyk();
    this.valid = true;
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
