import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Alert, AlertConfiguration, CronPayload, Group } from '../../../@core/data/data';
import { AlertConfigType, Operator, days, AlertType } from '../../../@core/data/enum';
import { TimeLimit } from '../../../@core/data/TimeLimit.enum';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { AlertsService } from '../../../@core/service/alerts.service';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { owner } from '../../../global.config';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent implements OnInit {

  @Input() alert: Alert = new Alert();
  timePlan: string;
  weekDays: string = ''//'every day';
  strValueConfig: string;
  cron: CronPayload = new CronPayload();
  owner: string;
  alive: boolean = true;

  @Output()
  onDeleteAlert: EventEmitter<number> = new EventEmitter();
  faIcon = FA_ICONS;
  constructor(private dialogService: NbDialogService, public alertService: AlertsService,
    private dataService: DataManagementService, private toastrService: NbToastrService,
     private translateService: TranslateService, public myTranslateService: MyTranslateService) {
    this.owner = owner;
    
    this.translate();
    
    this.myTranslateService.translate$
    .pipe(takeWhile(() => this.alive))
    .subscribe(() => {
      this.translate();
    });
      
  }

  translate(){
    this.translateService.get(['ALERT.everyDay', 'ALERT.Mon','ALERT.Tue','ALERT.Wed', 
      'ALERT.Thu', 'ALERT.Fri', 'ALERT.Sat','ALERT.Sun'])
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {
        if(this.weekDays.indexOf(',')<0) {
          this.weekDays = resp['ALERT.everyDay'];
        } else {
          this.getWeekDays();
          this.weekDays = this.weekDays.replace('Mon', resp['ALERT.Mon'])
        .replace('Tue', resp['ALERT.Tue']).replace('Wed', resp['ALERT.Wed'])
        .replace('Thu', resp['ALERT.Thu']).replace('Fri',resp['ALERT.Fri'])
        .replace('Sat', resp['ALERT.Sat']).replace('Sun', resp['ALERT.Sun']);
        }

      });
  }

  ngOnInit() {
    this.cron.from.time = undefined;
    this.cron.to.time = undefined;
    this.getDateRange();
    this.getTimeRange();
    this.getWeekDays();
    this.getValue();
  }

  OnToggleChange() {
    this.alertService.toggleAlertStatus(this.alert.id, !this.alert.isActive).subscribe(
      (resp) => this.alert.isActive = !this.alert.isActive
    );
  }


  OnDeleteConfirm() {
    this.toastrService.control
      ('<button type="button" class="btn clear btn-toastr" onclick="toastr.clear()">OK</button>', 'Alert!', {
        destroyByClick: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT
      });
  }

  OnEdit() {
    this.dialogService.open(AlertDialogComponent,
      { closeOnEsc: true, 'hasScroll': true, 
      context: { alert: this.alertService.deepClone(this.alert), cron: this.cron.deepClone() } });
  }

  private getDateRange() {
    let dateConfig: AlertConfiguration = this.alert.configs.filter(e => e.type == AlertConfigType.DATE)[0];
    if (dateConfig) {
      if (dateConfig.operator == Operator.MIN) {
        this.cron.from.date = new Date(dateConfig.value1);
        this.cron.from.date.setDate(dateConfig.value1.split('-')[2]);
      }
      else if (dateConfig.operator == Operator.MAX) {
        this.cron.to.date = new Date(dateConfig.value1);
        this.cron.to.date.setDate(dateConfig.value2.split('-')[2]);
      }
      else if (dateConfig.operator == Operator.BETWEEN) {
        this.cron.to.date = new Date(dateConfig.value2);
        this.cron.from.date = new Date(dateConfig.value1);
        this.cron.from.date.setDate(dateConfig.value1.split('-')[2]);
        this.cron.to.date.setDate(dateConfig.value2.split('-')[2]);
      }
    }
  }

  private getTimeRange() {
    let timeConfig: AlertConfiguration = this.alert.configs.filter(e => e.type == AlertConfigType.TIME)[0];
    if (timeConfig) {
      if (timeConfig.operator == Operator.EQUAL) {
        if (this.alert.type == AlertType.ENERGY && timeConfig.value1 == 'tl1') {
          this.alert.configs = this.alert.configs.filter(e => e.type != AlertConfigType.TIME);
        } else {
          this.cron.timePlan = Object.keys(TimeLimit).filter(e => TimeLimit[e] == timeConfig.value1)[0];
          this.timePlan = this.cron.timePlan;
        }
      }
      else if (timeConfig.operator == Operator.MIN) {
        this.cron.timePlan = 'CUSTOM';
        this.cron.from.time = { hours: timeConfig.value1.split(':')[0], minutes: timeConfig.value1.split(':')[1] };
      }
      else if (timeConfig.operator == Operator.MAX) {
        this.cron.timePlan = 'CUSTOM';
        this.cron.to.time = { hours: timeConfig.value1.split(':')[0], minutes: timeConfig.value1.split(':')[1] };
      }
      else if (timeConfig.operator == Operator.BETWEEN) {
        this.cron.timePlan = 'CUSTOM';
        this.cron.to.time = { hours: timeConfig.value2.split(':')[0], minutes: timeConfig.value2.split(':')[1] };
        this.cron.from.time = { hours: timeConfig.value1.split(':')[0], minutes: timeConfig.value1.split(':')[1] };
      }
    }
  }

  private getWeekDays() {
    let weekDaysConfig: AlertConfiguration = this.alert.configs.filter(e => e.type == AlertConfigType.WEEK_DAYS)[0];
    if (weekDaysConfig) {
      let daysStr = weekDaysConfig.value1 + '';
      Object.keys(this.cron.days).forEach(
        (e, index) => { if (daysStr.indexOf(index + '') < 0) { this.cron.days[e] = false; } })
      let dayArray: any[] = daysStr.split(',');
      this.weekDays = dayArray.map(e => ' ' + days[+e]).toString();
        }
  }

  private getValue() {
    let unit: string = this.alertService.getUnit(this.alert.type);
   
    if (this.alert.type == AlertType.DISCONNECTION) {
      this.alert.configs = this.alert.configs.filter(cfg => cfg.type != AlertConfigType.DISCONNECTION);
    }
    let valueConfig: AlertConfiguration = this.alert.configs.filter(e => e.type != AlertConfigType.WEEK_DAYS && e.type != AlertConfigType.DATE && e.type != AlertConfigType.TIME)[0];
    if (valueConfig) {
      let value1 = valueConfig.value1;
      if (valueConfig.type == AlertConfigType.ACTIVE_W_DAY && this.alert.measureType == 'GROUP' && valueConfig.value1 == 'Threshold') {
        let group: Group = this.dataService.tenantData.zones.flatMap(zone => zone.installations).flatMap(installation => installation.groupses).find(group => group.id == +this.alert.measureId);
        let thresholds = (group != undefined) ? { threshold: group.threshold, dayThreshold: group.thresholdDay, nightThreshold: group.thresholdNight } : { threshold: null, dayThreshold: null, nightThreshold: null };
        if (owner == 'AZIZA' && this.cron.timePlan == 'OPENED') { value1 = thresholds['dayThreshold'] }
        else if (owner == 'AZIZA' && this.cron.timePlan == 'CLOSED') { value1 = thresholds['nightThreshold'] }
        else value1 = thresholds['threshold'];
      }
      this.strValueConfig = `${Object.keys(Operator).filter(e => Operator[e] == valueConfig.operator)[0]}`;
      if (valueConfig.value1 != null) {
        this.strValueConfig += ` ${value1} ${unit}`;
        if (valueConfig.value2 != null) {
          this.strValueConfig += ` and`;
        }
      }
      if (valueConfig.value2 != null) {
        this.strValueConfig += ` ${valueConfig.value2} ${unit}`;
      }
      if(this.alert.pendingPeriod != 0 && this.alert.pendingPeriod != undefined) {
        this.strValueConfig +=  ` pour ${this.alert.pendingPeriod} minutes`;
      }
    }
  }

  getFatherName() {
    try {
      switch (owner) {
        case 'METOS':
          return this.dataService.tenantData.zones[0].installations
            .flatMap(i => i.stations)
            .filter(s => s.id == this.alert.fatherId)[0].name;
        // case 'DEPOT':
        default:
          this.alert.fatherId = this.alert.installationId;
          return this.dataService.tenantData.zones
            .flatMap(z => z.installations)
            .filter(i => i.id == +this.alert.installationId)[0].name;
      }
    } catch (error) { }
  }


  getZoneName() {
    try {
      return this.dataService.tenantData.zones.find(z => z.idZone == +this.alert.zoneId).name;
    } catch (error) {
      return '';
    }
  }

  getInputCatName() {
    try {
      if (this.alert.measureType == 'INPUT')
        return this.dataService.tenantData.zones[0].installations[0].inputs
          .find(inp => inp.id == +this.alert.measureId).category.name +' - ';
    } catch (e) { return ''; }
    return '';
  }

  getAlertMeasureName() {
    try {
      switch (this.alert.measureType) {
        case 'PHASE': {
          let group: Group = this.dataService.tenantData.zones.flatMap(z => z.installations)
            .flatMap(i => i.groupses).filter(g => g.phases.filter(p => p.id == +this.alert.measureId).length > 0)[0];
          let indx: number = +this.alert.measureId - group.phases.sort(function (a, b) {
            if (a.id < b.id) { return -1; }
            if (a.id > b.id) { return 1; }
            return 0;
          })[0].id + 1;
          return group.name + ' - phase ' + indx;
        }
        default: return this.getInputCatName() + this.alert.measureName;
      }
    } catch (error) {
      return this.alert.measureName;
    }
  }
  tabsComponent = NgxPopoverTabsComponent;
  onSupp(){
    this.alertService.suppId = this.alert.id;
  }
}

@Component({
  selector: 'ngx-popover-tabs',
  template: `
        <div class="p-4 d-flex align-items-center">
          Êtes-vous sûr de vouloir supprimer?
          <button nbButton status="primary" size="small" class="pointer ml-2 pr-2"
           (click)="onDeleteConfirm()">
          <span>Confirmer</span></button>
         </div>
  `,
})
export class NgxPopoverTabsComponent implements OnInit, OnDestroy {
  alertId: number = null; 
  constructor(private alertsService: AlertsService) { }

  ngOnDestroy(): void {
    this.alertsService.popupOpen$.emit(null);
  }

  ngOnInit(): void {
    this.alertId = this.alertsService.suppId; 
    this.alertsService.popupOpen$.emit(this.alertsService.suppId);
  }
  onDeleteConfirm() {
    this.alertsService.deleteAlert(this.alertId).subscribe(
      (resp) => { this.alertsService.emitAlerts(); },
      (error) => { }
    );
  }
}