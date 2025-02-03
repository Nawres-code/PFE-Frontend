import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrafficBar, TrafficBarData } from '../../../../../@core/data/traffic-bar';
import { TrafficList, TrafficListData } from '../../../../../@core/data/traffic-list';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-traffic-reveal-card',
  templateUrl: './traffic-reveal-card.component.html',
  styleUrls: ['./traffic-reveal-card.component.scss']
})
export class TrafficRevealCardComponent implements OnDestroy {

  private alive = true;

  trafficBarData: TrafficBar;
  trafficListData: TrafficList;
  revealed = false;
  period: string = 'week';

  constructor(private trafficListService: TrafficListData,
              private trafficBarService: TrafficBarData) {
    this.getTrafficFrontCardData(this.period);
    this.getTrafficBackCardData(this.period);
  }

  toggleView() {
    this.revealed = !this.revealed;
  }

  setPeriodAngGetData(value: string): void {
    this.period = value;

    this.getTrafficFrontCardData(value);
    this.getTrafficBackCardData(value);
  }

  getTrafficBackCardData(period: string) {
    this.trafficBarService.getTrafficBarData(period)
      .pipe(takeWhile(() => this.alive ))
      .subscribe(trafficBarData => {
        this.trafficBarData = trafficBarData;
      });
  }

  getTrafficFrontCardData(period: string) {
    this.trafficListService.getTrafficListData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(trafficListData => {
        this.trafficListData = trafficListData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
