export class Color {
  red: number;
  green: number;
  blue: number;
  hue: number;
  sat: number;
  lightness: number;
  hueHWB: number;
  whiteness: number;
  blackness: number;
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  opacity: number;
  valid: boolean = true;

  constructor() {
    this.fromRGB(255, 255, 255);
  }

  fromRGB(r: number, g: number, b: number) {
    if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      this.valid = false;
      return false;
    }

    this.red = r;
    this.green = g;
    this.blue = b;

    this.rgbToCmyk(r, g, b);
    this.rgbToHsl(r, g, b);
    this.rgbToHwb(r, g, b);
  }

  fromHSL(hue, sat, light) {
    this.hue = hue;
    this.sat = sat/100;
    this.lightness = light/100;

    this.hslToRgb(this.hue, this.sat, this.lightness);
    this.fromRGB(this.red, this.green, this.blue);
  }

  fromCMYK(c,m,y,k) {
    this.cyan = c / 100;
    this.magenta = m / 100;
    this.yellow = y / 100;
    this.black = k / 100;

    this.cmykToRgb(this.cyan, this.magenta, this.yellow, this.black);
    this.fromRGB(this.red, this.green, this.blue);
  }

  hslToRgb(hue, sat, light) {
    let t1, t2, r, g, b;
    hue = hue / 60;
    if ( light <= 0.5 ) {
      t2 = light * (sat + 1);
    } else {
      t2 = light + sat - (light * sat);
    }
    t1 = light * 2 - t2;
    r = this.hueToRgb(t1, t2, hue + 2) * 255;
    g = this.hueToRgb(t1, t2, hue) * 255;
    b = this.hueToRgb(t1, t2, hue - 2) * 255;

    this.red = Math.round(r);
    this.green = Math.round(g);
    this.blue = Math.round(b);

    return {r : r, g : g, b : b};
  }

  hueToRgb(t1, t2, hue) {
    if (hue < 0) hue += 6;
    if (hue >= 6) hue -= 6;
    if (hue < 1) return (t2 - t1) * hue + t1;
    else if(hue < 3) return t2;
    else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
    else return t1;
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
    }

    this.hue = Math.round(h*60);
    this.sat = Math.round(s*100);
    this.lightness = Math.round(l*100);

    return [ h, s, l ];
  }

  rgbToHwb(r, g, b) {
    let h, w, bl;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let chroma = max - min;
    if (chroma == 0) {
      h = 0;
    } else if (r == max) {
      h = (((g - b) / chroma) % 6) * 360;
    } else if (g == max) {
      h = ((((b - r) / chroma) + 2) % 6) * 360;
    } else {
      h = ((((r - g) / chroma) + 4) % 6) * 360;
    }

    w = min;
    bl = 1 - max;
    this.hueHWB = Math.round(h);
    this.whiteness = Math.round(w*100);
    this.blackness = Math.round(b*100);
    return {h : h, w : w, b : bl};
  }

  rgbToCmyk(r, g, b) {
    let c, m, y, k;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    let max = Math.max(r, g, b);
    k = 1 - max;
    if (k == 1) {
      c = 0;
      m = 0;
      y = 0;
    } else {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
    }

    this.cyan = Math.round(c*100);
    this.magenta = Math.round(m*100);
    this.yellow = Math.round(y*100);
    this.black = Math.round(k*100);
    return {c : c, m : m, y : y, k : k};
  }

  cmykToRgb(c,m,y,k) {
    let r = 1 - Math.min( 1, c * ( 1 - k ) + k );
    let g = 1 - Math.min( 1, m * ( 1 - k ) + k );
    let b = 1 - Math.min( 1, y * ( 1 - k ) + k );

    r = Math.round( r * 255 );
    g = Math.round( g * 255 );
    b = Math.round( b * 255 );

    this.red = r;
    this.green = g;
    this.blue = b;

    return {r: r, g: g, b: b};
  }

  printRGB() {
    return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
  }

  printHex() {
    let red = this.red.toString(16);
    if(this.red < 16)
      red = '0' + red;

    let green = this.green.toString(16);
    if(this.green < 16)
      green = '0' + green;

    let blue = this.blue.toString(16);
    if(this.blue < 16)
      blue = '0' + blue;

    return ('#' + red + green + blue).toUpperCase();
  }

  printHsl() {
    return 'hsl(' + this.hue + ', ' + this.sat + '%, ' + this.lightness + '%)';
  }

  printHwb() {
    return 'hwb(' + this.hueHWB + ', ' + this.whiteness + '%, ' + this.blackness + '%)';
  }

  printCmyk() {
    return 'cmyk(' + this.cyan + '%, ' + this.magenta + '%, ' + this.yellow + '%, ' + this.black + '%)';
  }
}
