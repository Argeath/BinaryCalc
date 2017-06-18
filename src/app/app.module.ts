import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';

import '../styles/styles.scss';
import '../styles/headings.css';
import {ChmodComponent} from './chmod/chmod.component';
import {TagCloudComponent} from './tag-cloud/tag-cloud.component';
import {UnixTimeComponent} from './unixTime/unixTime.component';
import {ColorsComponent} from './colors/colors.component';
import {InfoComponent} from './info/info.component';
import {ErrorComponent} from './error/error.component';
import {ResultComponent} from './result/result.component';
import {RomaniansComponent} from './romanians/romanians.component';
import {BinariesComponent} from './binaries/binaries.component';
import {ArithmeticsComponent} from './arithmetics/arithmetics.component';
import {NegativesComponent} from './negatives/negatives.component';
import {ConversionsComponent} from './conversions/conversions.component';
import {MenuComponent} from './menu/menu.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InputWithSystemComponent} from "./inputWithSystem/inputWithSystem.component";
import {OperationSelectComponent} from "./operation-select/operation-select.component";

// Application wide providers
const APP_PROVIDERS = [
];

type StoreType = {
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
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
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
