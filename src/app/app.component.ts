import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversionsService } from './services/conversions.service';
import { Title } from '@angular/platform-browser';
import { MetaDataService } from './services/meta-data.service';
import {Subscription} from 'rxjs/Subscription';
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ConversionsService,
    MetaDataService,
    Title
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  private titleSubscribe: Subscription;

  public constructor(private titleService: Title,
                     private meta: MetaDataService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
  }

  public ngOnInit(): void {
    this.titleSubscribe = this.meta.title$.subscribe((val) => this.titleService.setTitle(val));
  }

  public ngOnDestroy(): void {
    this.titleSubscribe.unsubscribe();
  }
}
