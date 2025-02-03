import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TrafficList } from '../../../../../../@core/data/traffic-list';

@Component({
  selector: 'ngx-traffic-cards-front',
  templateUrl: './traffic-cards-front.component.html',
  styleUrls: ['./traffic-cards-front.component.scss']
})
export class TrafficCardsFrontComponent implements OnDestroy {

  private alive = true;

  @Input() frontCardData: TrafficList;

  currentTheme: string;

  constructor() {

  }

  trackByDate(_, item) {
    return item.date;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
