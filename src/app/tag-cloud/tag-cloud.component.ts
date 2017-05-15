import {Component, Input} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.sass'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class TagCloudComponent {

  @Input()
  tags: string[] = [];

  constructor(private location: Location, private route:ActivatedRoute) {}

  public getURL(tagname: string) {
    return this.location.prepareExternalUrl(this.route.snapshot.url[0].path + "/" + tagname.replace(/ /g, '-'));
  }
}
