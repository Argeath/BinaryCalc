import {Component, OnInit, Input} from '@angular/core';
import {ConversionsService} from "../conversions.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit {

  @Input() title: string = "Result";
  @Input() results = [];
  @Input() warningIf: boolean = false;
  @Input() warning: string = '';
  @Input() error: string = '';
  @Input() single: boolean = false;
  @Input() result = '';
  @Input() customSystems = null;

  systems = [];

  constructor(public conversions: ConversionsService) {
    this.systems = conversions.systems;
  }

  ngOnInit(): void {
    if(this.customSystems != null)
      this.systems = this.customSystems;
  }
}
