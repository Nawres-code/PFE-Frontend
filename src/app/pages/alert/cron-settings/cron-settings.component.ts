import { Component, OnInit, Input } from '@angular/core';
import { AlertsService } from '../../../@core/service/alerts.service';
import { CronPayload } from "../../../@core/data/data";
import { TimeLimit } from '../../../@core/data/TimeLimit.enum';
import { FormControl } from '@angular/forms';
import { owner } from '../../../global.config';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-cron-settings',
  templateUrl: './cron-settings.component.html',
  styleUrls: ['./cron-settings.component.scss']
})
export class CronSettingsComponent implements OnInit {
  @Input() cron: CronPayload = new CronPayload();
  @Input() hideDateRange: boolean = false;
  @Input() hideCustomTime: boolean = false;
  @Input() hideWeekDays: boolean = false;
  @Input() showTimeLimits: boolean = true;

  timePlan = [];
  hours = [];
  minutes = [];

  startDateControl;
  endDateControl;
  owner = owner;

  faIcon = FA_ICONS;
  constructor(private alertService: AlertsService) {
  }

 

  ngOnInit() {
    this.initHours();
    this.initMinutes();
    if (this.showTimeLimits) {
      Object.keys(TimeLimit).forEach(e => this.timePlan.push(e));
      if (!this.hideCustomTime && Object.keys(TimeLimit).length != 0) {
        this.timePlan.push('CUSTOM');
      }
      if (!this.hideCustomTime && this.cron.timePlan != 'CUSTOM') {
        this.hideCustomTime = true;
      }
    }
    this.startDateControl = new FormControl( this.cron.from.date);
    this.endDateControl = new FormControl( this.cron.to.date);
  }

  initHours() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(
        {
          value: i + '',
          label: i > 9 ? i + '' : '0' + i
        });
    }
  }

  initMinutes() {
    for (let i = 0; i < 4; i++) {
      this.minutes.push({
        value: i * 15 + '',
        label: i != 0 ? (i * 15) + '' : '0' + i
      });
    }
  }

  onResetDateRange() {
    this.cron.from.date = null;
    this.cron.to.date = null;
    this.startDateControl = new FormControl( this.cron.from.date);
    this.endDateControl = new FormControl( this.cron.to.date);
  }

  onResetTime() {
    // test time limits
    this.cron.timePlan = 'off';
    if (this.showTimeLimits) {
      this.hideCustomTime = true;
    } else {
      this.hideCustomTime = false;
    }
    this.cron.from = { time: { hours: 'HH', minutes: '0' }, date: this.cron.from.date };
    this.cron.to = { time: { hours: 'HH', minutes: '0' }, date: this.cron.to.date };
    // this.cron.initTime();
    this.alertService.tlChanged$.emit(this.cron.timePlan);
  }

  onResetWeekDays() {
    this.cron.initDays(true);
  }

  change(plan) {
    if (plan == 'CUSTOM') {
      this.hideCustomTime = false;
    } else {
      this.hideCustomTime = true;
      this.cron.from = { time: { hours: null, minutes: '0' }, date: this.cron.from.date };
      this.cron.to = { time: { hours: null, minutes: '0' }, date: this.cron.to.date };
      //this.cron.initTime();
      this.alertService.tlChanged$.emit(plan);
    }
  }

  timeChanged() {
    if (!this.showTimeLimits) {
      this.cron.timePlan = 'CUSTOM';
      this.hideCustomTime = false;
    }
    if (this.cron.from.time['hours'] == null) {
      this.cron.from.time['hours'] = '0';
    }
    if (this.cron.to.time['hours'] == null) {
      this.cron.to.time['hours'] = '0';
    }
  }

}
