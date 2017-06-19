import {Component, OnInit, OnDestroy} from '@angular/core';
import { ConversionsService } from './services/conversions.service';
import { Title } from '@angular/platform-browser';
import { MetaDataService } from './services/meta-data.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ConversionsService,
    MetaDataService,
    Title
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  public ENV = ENV;

  titleSubscribe: Subscription;

  public constructor(private titleService: Title,
                     private meta: MetaDataService) {
  }

  public ngOnInit(): void {
    this.titleSubscribe = this.meta.title$.subscribe((val) => this.titleService.setTitle(val));
  }

  ngOnDestroy(): void {
    this.titleSubscribe.unsubscribe();
  }
}
