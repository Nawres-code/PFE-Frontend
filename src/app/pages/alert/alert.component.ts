import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbToastrService, NbDialogService, NbSidebarService } from '@nebular/theme';
import { DataManagementService } from "../../@core/service/data-management.service";
import { Installation, Alert, CronPayload, Station, Sensor, Inputs, Zone } from '../../@core/data/data';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AlertsService } from '../../@core/service/alerts.service';
import { Subscription } from 'rxjs';
import { owner } from '../../global.config';
import { UserAlertFilterDto } from '../../@core/data/dataDto';
import { delay, takeWhile } from 'rxjs/operators';
import { orderByField } from '../../@core/utils/global/order';
import { FA_ICONS } from '../../@core/utils/global/fa-icons';
import { LayoutService } from '../../@core/utils';
@Component({
  selector: 'ngx-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  closeAll: boolean = false;
  alerts: Alert[] = [];
  alertsSubscription: Subscription;

  // alert types selection
  type = { lbl: 'Tout types', value: '' }; // this.titles[0];

  // selection zone 
  selectedZone: Zone = null;
  zones: Zone[] = [];

  // selection Instalation
  installations: Installation[] = Array();
  selectedInstallation: Installation = null;

  //select mesure
  selectedMeasures: any[] = Array();
  measureIds: any[] = new Array();
  selectedMeasureType: string;

  //stations & sensors
  stations: Station[] = Array();
  selectedStations: any[] = Array();
  sensors: Sensor[] = Array();
  stationIds = new Array();

  // paginator
  pageSize = 8;
  pageSizeOptions: number[] = [3, 8];
  startPageIndex = 0;
  endPageIndex = this.startPageIndex + this.pageSize;
  owner = owner;


  deleteId: number = null;
  loading: boolean = false;
  faIcon = FA_ICONS;
  constructor(public toastr: NbToastrService,
    private dataManagementService: DataManagementService,
    public alertService: AlertsService,
    private dialogService: NbDialogService, private sidebarService: NbSidebarService, private layoutService: LayoutService) {

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init(this.dataManagementService.tenantData.zones, this.dataManagementService.tenantData.sensors);
    } catch (error) { }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(50))
      .subscribe(res => {
        this.init(this.dataManagementService.tenantData.zones);
        this.init(null, this.dataManagementService.tenantData.sensors);
      });
    this.setAlertFilter();
  }

  init(zones, sensors?) {
    if (zones) {
      try {
        this.dataManagementService.tenantData.zones = zones;
        this.zones = zones;
        if (zones.length == 1) {
          this.selectedZone = zones[0];
          this.onZoneChange();
        }
        this.stations = this.installations[0].stations;
      } catch (error) { }
    }
    if (sensors) {
      this.dataManagementService.tenantData.sensors = sensors;
      this.sensors = sensors;
    }
    switch (this.owner) {
      case 'MEKATECH':
      case 'FLEETDEPOT':
      case 'IOT':
      case 'DEPOT':
        this.selectedMeasureType = 'SONDE';
        break;
      case 'TRICITY':
      case 'CDC':
      case 'ANME':
      case 'KASSAB':
      case 'KASSAB2':
        this.selectedMeasureType = 'GROUP';
        break;
      case 'METOS':
        this.selectedMeasureType = 'STATION';
        break;
      case 'INPUT':
        this.selectedMeasureType = 'INPUT';
        this.selectedInstallation = this.selectedZone.installations[0];
        break;
    }
  }

  ngOnInit() {
    this.alertsSubscription = this.alertService.alertsSubject
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        alerts => this.alerts = alerts == null ? [] : alerts
      );
    this.alertService.popupOpen$
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {
        if (resp == null) {
          this.closeAll = true;
        } else {
          this.closeAll = false;
          this.deleteId = resp;
        }
      });
  }

  chooseMeasure(mesure) {
    this.measureIds = new Array();
    this.selectedMeasures.forEach(
      mesure => {
        if (this.selectedMeasureType === 'POINT') {
          this.measureIds.push(mesure.deviceId);
        }
        this.measureIds.push(mesure.id);
      });
    this.setAlertFilter();
  }

  onChangeAlertType(type) {
    this.setAlertFilter();
  }

  openDialogue() {
    this.dialogService.open(AlertDialogComponent,
      { 'closeOnEsc': false, 'closeOnBackdropClick': false, 'hasScroll': true, context: { alert: new Alert(), cron: new CronPayload() } });
  }

  getPageRange(event) { }

  /*getPageRange(event: PageEvent): PageEvent {
    this.startPageIndex = event.pageIndex * event.pageSize;
    this.endPageIndex = this.startPageIndex + event.pageSize;
    return event;
  }*/

  getMeasureContainer(val: String): any[] {
    try {
      if (this.owner == 'METOS') {
        return this.orderByName(this.sensors);
      }

      if (val == "POINT") {
        return orderByField(this.selectedInstallation.points, 'name');
      } else if (val == "DEVICE") {
        return this.orderByName(this.selectedInstallation.devices);
      } else if (val == "DEVICE_FROID") {
        return this.orderByName(this.selectedInstallation.deviceFroids);
      } else if (val == "GROUP") {
        return this.orderByName([...this.selectedInstallation.groupses, ...this.getPhv()]);
      } else if (val == "SONDE") {
        return this.orderByName(this.selectedInstallation.sondes);
      } else if (val == "INPUT") {
        return this.orderByName(this.selectedInstallation.inputs);
      } else if (val == "PHASE") {
        let phases = this.orderByName(this.selectedInstallation.groupses)
          .flatMap(g => {
            g.phases.forEach(p => p.name = g.name);
            return g.phases.sort(function (a, b) {
              if (a.id < b.id) { return -1; }
              if (a.id > b.id) { return 1; }
              return 0;
            });
          })
        for (let i = 1; i <= phases.length; i++) {
          phases[i - 1].name += ' - phase ' + ((i % 3) == 0 ? 3 : i % 3);
        }
        return phases;
      } else if (val.startsWith('IO_')) {
        return this.orderByName(this.selectedInstallation
          .ioList.filter(el => el.type == val.replace('IO_', '')));
      }


    } catch (error) {

    }
    return null;
  }

  onChangeInstallation(installation) {
    switch (this.owner) {
      case 'MEKATECH':
      case 'IOT':
      case 'DEPOT':
      case 'FLEETDEPOT':
        this.selectedMeasureType = "SONDE";
        this.selectedMeasures = [];
        this.measureIds = [];
        this.alerts = [];
        break;
      case 'AZIZA':
      case 'ANME':
      case 'TRICITY':
      case 'CDC':
      case 'KASSAB':
      case 'KASSAB2':
        this.selectedMeasureType = 'GROUP';
        this.selectedMeasures = [];
        this.measureIds = [];
        this.alerts = [];
        break;
      case 'INPUT':
        this.selectedMeasureType = "INPUT";
        this.selectedMeasures = [];
        this.measureIds = [];
        this.alerts = [];
        break;
      default:
        this.selectedMeasureType = "";
        this.selectedMeasures = [];
        this.measureIds = [];
        this.alerts = [];
    }
    this.setAlertFilter();
  }


  onZoneChange(event?) {
    this.installations = this.dataManagementService.tenantData.zones.find(z => z.idZone == this.selectedZone.idZone).installations;
    this.selectedInstallation = null;
    this.selectedMeasures = [];
    this.measureIds = [];
    this.setAlertFilter();

    // this.selectedStations = [];
  }
  chooseMeasureType() {
    this.selectedMeasures = [];
    this.alerts = [];
    this.type = null;
    this.setAlertFilter();
  }

  onChangeStations($event) {
    this.stationIds = [];
    this.selectedStations.forEach(station => {
      this.stationIds.push(station.id);
    });
    this.setAlertFilter();
  }

  private setAlertFilter() {
    this.alertService.alertFilter = new UserAlertFilterDto();
    switch (this.owner) {
      case 'METOS':
        this.alertService.alertFilter.userAlertType = this.type.value;
        if (this.stationIds.length <= 0 && this.measureIds.length > 0) {
          this.alertService.alertFilter.fatherIds = [];
          this.alertService.alertFilter.measureIds = this.measureIds;
          this.alertService.alertFilter.measureType = 'SENSOR';
        }
        else if (this.measureIds.length <= 0 && this.stationIds.length > 0) {
          this.alertService.alertFilter.fatherIds = [];
          this.alertService.alertFilter.measureIds = this.stationIds;
          this.alertService.alertFilter.measureType = 'STATION';
        } else if (this.stationIds.length > 0 && this.measureIds.length > 0) {
          this.alertService.alertFilter.fatherIds = this.stationIds;
          this.alertService.alertFilter.measureIds = this.measureIds;
          this.alertService.alertFilter.measureType = 'STATION_SENSOR';
        }
        break;
      case 'MEKATECH':
      case 'IOT':
      case 'DEPOT':
      case 'FLEETDEPOT':
        this.alertService.alertFilter.measureIds = this.measureIds;
        this.alertService.alertFilter.measureType = 'SONDE';
        this.alertService.alertFilter.userAlertType = this.type.value;
        try {
          this.alertService.alertFilter.zoneId = this.selectedZone.idZone;
        } catch (error) {
          this.alertService.alertFilter.zoneId = null;
        }
        try {
          this.alertService.alertFilter.installationId = this.selectedInstallation.id;
        } catch (error) {
          this.alertService.alertFilter.installationId = null;
        }
        break;
      case 'AZIZA':
      case 'TRICITY':
      case 'CDC':
      case 'ANME':
      case 'KASSAB':
      case 'KASSAB2':
        this.alertService.alertFilter.measureIds = this.measureIds;
        try {
          this.alertService.alertFilter.measureType = this.selectedMeasureType == undefined ? 'GROUP' : this.selectedMeasureType;
        } catch (error) {
        }
        try {
          this.alertService.alertFilter.userAlertType = this.type.value;
        } catch (error) {
          this.alertService.alertFilter.userAlertType = '';
        }
        try {
          this.alertService.alertFilter.zoneId = this.selectedZone.idZone;
        } catch (error) {
          this.alertService.alertFilter.zoneId = null;
        }
        try {
          this.alertService.alertFilter.installationId = this.selectedInstallation.id;
        } catch (error) {
          this.alertService.alertFilter.installationId = null;
        }

        break;
      case 'INPUT':
        this.alertService.alertFilter.measureIds = this.measureIds;
        this.alertService.alertFilter.measureType = 'INPUT';
        this.alertService.alertFilter.userAlertType = this.type.value;
        break;
    }
    this.alertService.emitAlerts();
  }

  getInputCategoriesName(installation: Installation): String[] {
    try {
      let x = new Set<String>();
      installation.inputs.map(inp => inp.category.name).forEach(
        c => { x.add(c); });
      return Array.from(x).sort();
    } catch (e) {
      return null;
    }
  }

  inputList(catName: string, installation: Installation): Inputs[] {
    try {
      return this.orderByName(installation.inputs.filter(inp => inp.category.name == catName));
    } catch (e) {
      return null;
    }
  }

  alive: boolean = true;
  ngOnDestroy(): void {
    this.alertsSubscription.unsubscribe();
    this.alive = false;
  }

  filterForUser(installations: Installation[]): Installation[] {
    return installations.filter(i => this.dataManagementService.userHasInstallation(i.id));
  }

  onDeleteAlert(event) {
    this.closeAll = false;
    this.deleteId = event;
  }

  orderByName(array: any[]) {
    return orderByField(array, 'name');
  }

  getPhv() {
    try {
      return this.selectedInstallation.provider.groupses.filter(g => g.type.toLowerCase() != 'general');
    } catch (error) {
      return [];
    }
  }

  getAllIoTypes(selectedInstallation) {
    try {
      let typeArr: string[] = [];
      typeArr = selectedInstallation.ioList.map(item => item.type)
        .sort();
      return new Set(typeArr);
    } catch (error) {
    }
  }

}
