import { Component, OnInit } from '@angular/core';
import { ConversionsService } from './services/conversions.service';
import { Title } from '@angular/platform-browser';
import { MetaDataService } from './services/meta-data.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [
    ConversionsService,
    MetaDataService,
    Title
  ]
})
export class AppComponent implements OnInit {

  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  public constructor(private titleService: Title,
                     private meta: MetaDataService) {
  }

  public ngOnInit(): void {
    this.meta.title$.subscribe((val) => this.titleService.setTitle(val));
  }
}
