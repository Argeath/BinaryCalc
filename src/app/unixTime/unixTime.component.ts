import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from "rxjs";
import * as moment from 'moment/moment';
import {MetaDataService} from "../meta-data.service";

@Component({
  selector: 'app-unixTime',
  templateUrl: './unixTime.component.html',
  styleUrls: ['./unixTime.component.sass']
})
export class UnixTimeComponent implements OnDestroy, OnInit {
  timer = null;

  value: string = '';
  currentTimestampSeconds: number = Math.ceil(Date.now()/1000);
  currentTimestamp: number = Date.now();

  systems = [
    {
      nr: null,
      name: 'Timestamp'
    },
    {
      nr: null,
      name: 'Human Date'
    }
  ];

  system: number = -1;
  detectedSystem: number = -1;
  systemManuallySelected: boolean = false;
  results = [];
  error: string = null;

  valid: boolean = false;

  constructor(private meta: MetaDataService) {
  }

  ngOnInit(): void {
    this.meta.title$.next("Binary Calculator - unix timestamp to readable format converter");
  }

  onStart() {
    this.timer = Observable.timer(1000, 1000).subscribe(t => {
      this.currentTimestamp = Math.ceil(Date.now() / 1000);
    });
  }

  ngOnDestroy() {
    if(this.timer)
      this.timer.unsubscribe();
  }

  systemSelected(newValue: number) {
    this.system = newValue;
    this.systemManuallySelected = this.system != -1;
    this.valueChange();
  }

  valueChange() {
    this.valid = false;
    this.error = null;
    const vl = this.value.toUpperCase();

    if (!this.systemManuallySelected) {
      this.detectedSystem = this.detectSystem(vl);
      this.system = this.detectedSystem;
    }
    if(this.system == -1) {
      this.error = 'Invalid Input';
    }
    let time;
    if(this.system == 0) {
      time = moment.unix(parseInt(vl));
    } else {
      time = moment(vl);
    }

    this.results[0] = time.unix();
    this.results[1] = time.format();
  }

  detectSystem(v: string): number {
    if(/^\d+$/.test(v)) { // Has only number
      return 0; // Timestamp
    } else {
      if(moment(v).isValid())
        return 1;
    }

    return -1;
  }
}
