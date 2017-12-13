import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {MenuComponent} from './menu/menu.component';
import {ConversionsComponent} from './conversions/conversions.component';
import {NegativesComponent} from './negatives/negatives.component';
import {ArithmeticsComponent} from './arithmetics/arithmetics.component';
import {BinariesComponent} from './binaries/binaries.component';
import {RomaniansComponent} from './romanians/romanians.component';
import {ResultComponent} from './result/result.component';
import {ErrorComponent} from './error/error.component';
import {InfoComponent} from './info/info.component';
import {ColorsComponent} from './colors/colors.component';
import {UnixTimeComponent} from './unixTime/unixTime.component';
import {TagCloudComponent} from './tag-cloud/tag-cloud.component';
import {ChmodComponent} from './chmod/chmod.component';
import {InputWithSystemComponent} from './inputWithSystem/inputWithSystem.component';
import {OperationSelectComponent} from './operation-select/operation-select.component';
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { Angulartics2Module } from "angulartics2";


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ConversionsComponent,
    NegativesComponent,
    ArithmeticsComponent,
    BinariesComponent,
    RomaniansComponent,
    ResultComponent,
    ErrorComponent,
    InfoComponent,
    ColorsComponent,
    UnixTimeComponent,
    TagCloudComponent,
    ChmodComponent,
    InputWithSystemComponent,
    OperationSelectComponent
  ],
  imports: [
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
