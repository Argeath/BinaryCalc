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
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import '../styles/styles.scss';
import '../styles/headings.css';
import {BsDropdownModule} from 'ngx-bootstrap';
import {ChmodComponent} from './chmod/chmod.component';
import {TagCloudComponent} from './tag-cloud/tag-cloud.component';
import {CopyClipboardDirective} from './copy-clipboard.directive';
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

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
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
    CopyClipboardDirective,
    TagCloudComponent,
    ChmodComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
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
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
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
