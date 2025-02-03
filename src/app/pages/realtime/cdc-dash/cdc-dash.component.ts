import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { owner } from '../../../global.config';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-cdc-dash',
  templateUrl: './cdc-dash.component.html',
  styleUrls: ['./cdc-dash.component.scss']
})
export class CdcDashComponent implements OnDestroy {

  owner: string;

  constructor() {
    this.owner = owner;
  }

  ngOnDestroy() {
  }
}
