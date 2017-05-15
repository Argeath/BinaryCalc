import { Routes } from '@angular/router';
import {ConversionsComponent} from './conversions/conversions.component';
import {NegativesComponent} from './negatives/negatives.component';
import {ArithmeticsComponent} from './arithmetics/arithmetics.component';
import {BinariesComponent} from './binaries/binaries.component';
import {RomaniansComponent} from './romanians/romanians.component';
import {ColorsComponent} from './colors/colors.component';
import {UnixTimeComponent} from './unixTime/unixTime.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/number-system-converter', pathMatch: 'full' },
  {
    path: 'number-system-converter',
    component: ConversionsComponent
  },
  {
    path: 'number-system-converter/**',
    component: ConversionsComponent
  },
  {
    path: 'negative-numbers',
    component: NegativesComponent
  },
  {
    path: 'arithmetic-operations',
    component: ArithmeticsComponent
  },
  {
    path: 'binary-operations',
    component: BinariesComponent
  },
  {
    path: 'roman-numerals',
    component: RomaniansComponent
  },
  {
    path: 'color-converter',
    component: ColorsComponent
  },
  {
    path: 'unix-timestamp',
    component: UnixTimeComponent
  },
  {
    path: '**',
    component: ConversionsComponent
  }
];
