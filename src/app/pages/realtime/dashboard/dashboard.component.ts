import {Component, OnDestroy} from '@angular/core';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent  implements OnDestroy {
  alive: boolean = true;
  owner = owner;

  constructor() { 
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
