import {Component, OnInit, Input} from '@angular/core';
import {ConversionsService} from '../conversions.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit {

  @Input() public title: string = 'Result';
  @Input() public results = [];
  @Input() public warningIf: boolean = false;
  @Input() public warning: string = '';
  @Input() public error: string = '';
  @Input() public single: boolean = false;
  @Input() public result = '';
  @Input() public customSystems = null;

  public systems = [];

  constructor(public conversions: ConversionsService) {
    this.systems = conversions.systems;
  }

  public ngOnInit(): void {
    if (this.customSystems != null) {
      this.systems = this.customSystems;
    }
  }
}
