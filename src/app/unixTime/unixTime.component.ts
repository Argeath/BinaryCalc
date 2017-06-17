import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
// import * as moment from 'moment/moment';
import { MetaDataService } from '../services/meta-data.service';

@Component({
  selector: 'app-unixTime',
  templateUrl: './unixTime.component.html',
  styleUrls: ['./unixTime.component.sass']
})
export class UnixTimeComponent implements OnDestroy, OnInit {
  public timer = null;

  public value: string = '';
  public currentTimestampSeconds: number = Math.ceil(Date.now() / 1000);
  public currentTimestamp: number = Date.now();

  public systems = [
    {
      nr: null,
      name: 'Timestamp'
    },
    {
      nr: null,
      name: 'Human Date'
    }
  ];

  public system: number = -1;
  public detectedSystem: number = -1;
  public systemManuallySelected: boolean = false;
  public results = [];
  public error: string = null;

  public valid: boolean = false;

  constructor(private meta: MetaDataService) {
  }

  public ngOnInit(): void {
    this.meta.title$.next('Binary Calculator - unix timestamp to readable format converter');
  }

  public onStart() {
    this.timer = Observable.timer(1000, 1000).subscribe((t) => {
      this.currentTimestamp = Math.ceil(Date.now() / 1000);
    });
  }

  public ngOnDestroy() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  public systemSelected(newValue: number) {
    this.system = newValue;
    this.systemManuallySelected = this.system !== -1;
    this.valueChange();
  }

  public valueChange() {
    this.valid = false;
    this.error = null;
    const vl = this.value.toUpperCase();

    if (!this.systemManuallySelected) {
      this.detectedSystem = this.detectSystem(vl);
      this.system = this.detectedSystem;
    }
    if (this.system === -1) {
      this.error = 'Invalid Input';
    }
    /*let time;
    if (this.system == 0) {
      time = moment.unix(parseInt(vl));
    } else {
      time = moment(vl);
    }

    this.results[0] = time.unix();
    this.results[1] = time.format();*/
  }

  private detectSystem(v: string): number {
    if (/^\d+$/.test(v)) { // Has only number
      return 0; // Timestamp
    } else {
     // if (moment(v).isValid())
       // return 1;
    }

    return -1;
  }
}
