import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Alert, CronPayload, AlertConfiguration, Installation, Station, Sensor, Inputs, Zone } from '../../../@core/data/data';
import { AlertConfigType, AlertType, Operator } from '../../../@core/data/enum';
import { owner } from '../../../global.config'
import { DataManagementService } from '../../../@core/service/data-management.service';
import { myConstants } from './alert-dialog.const';
import { orderByField } from '../../../@core/utils/global/order';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';
@Component({
  selector: 'ngx-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
  titles = ['ENERGY', 'DISCONNECTION', 'VARIATION', 'TEMPERATURE THRESHOLD', 'TEMPERATURE', 'SIMPLE'];
  alert: Alert;
  cron: CronPayload;
  valueConfig: AlertConfiguration = new AlertConfiguration();
  owner = owner;
  render = myConstants;

  // selection zone 
  selectedZone: Zone = null;

  // selection Instalation
  installations: Installation[] = Array();
  selectedInstallation: Installation = null;

  // select mesure
  selectedMeasures: any[] = Array();
  measureIds: any[] = new Array();
  selectedMeasureType: string;

  // stations & sensors
  sensors: Sensor[] = Array();
  stations: Station[] = Array();
  selectedStations: any[] = Array();
  stationIds = new Array();

  formItemsRender: any = { 'installation': true, 'measureType': true, 'station': false, 'measure': true, 'alertType': true };

  next: boolean = false;

  faIcon = FA_ICONS;
  constructor(private ref: NbDialogRef<any>, public dataManagementService: DataManagementService) { }

  ngOnInit() {
    switch (owner) {
      case 'METOS':
        this.formItemsRender = { 'installation': false, 'measureType': false, 'station': true, 'measure': true, 'alertType': false };
        this.alert.measureType = 'SENSOR';
        this.next = true;
        break;
      case 'FLEETDEPOT':
      case 'MEKATECH':
      case 'IOT':
      case 'DEPOT':
        this.selectedMeasureType = 'SONDE';
        break;
      case 'TRICITY':
      case 'CDC':
      case 'AZIZA':
      case 'ANME':
      case 'KASSAB':
      case 'KASSAB2':
        // this.formItemsRender = {'installation':true, 'measureType':true, 'station':false, 'measure':true, 'alertType':true};  
        this.selectedMeasureType = 'GROUP';
        break;
      case 'INPUT':
        this.selectedMeasureType = 'INPUT';
        this.selectedInstallation = this.dataManagementService.tenantData.zones[0].installations[0];
        //  this.formItemsRender = {'installation':true, 'measureType':true, 'station':false, 'measure':true, 'alertType':true};
        //this.alert.type = AlertType.SIMPLE;
        this.alert.measureType = 'INPUT';
        break;
    }
    // create
    if (this.alert.id <= 0) {
      this.cron = new CronPayload();
      this.cron.initDays(true);
      this.setValueConfig();
      if (this.dataManagementService.tenantData.zones.length == 1) {
        this.selectedZone = this.dataManagementService.tenantData.zones[0];
        this.onZoneChange();
        switch (this.owner) {
          case 'INPUT':
            this.selectedInstallation = this.selectedZone.installations[0];
            break;
          case 'METOS':
            this.selectedInstallation = this.selectedZone.installations[0];
            this.stations = this.selectedInstallation.stations;
            this.sensors = this.dataManagementService.tenantData.sensors;
            this.alert.measureType = 'SENSOR';
            this.selectedMeasureType = this.alert.measureType;
            break;

        }
      }
    } else { // update
      this.selectedZone = this.dataManagementService.tenantData.zones.find(z => z.idZone == +this.alert.zoneId);
      this.onZoneChange()
      this.selectedInstallation = this.installations.find(inst => inst.id == +this.alert.installationId);
      this.selectedMeasureType = this.alert.measureType;
      switch (this.owner) {
        case 'INPUT':
          let cat = this.selectedInstallation.inputs.find(m => m.id == +this.alert.measureId).category.name;
          this.selectedMeasures = [this.inputList(cat, this.selectedInstallation).find(m => m.id == +this.alert.measureId)];
          break;

        case 'METOS':
          this.selectedInstallation = this.selectedZone.installations[0];
          this.stations = this.selectedInstallation.stations;
          this.sensors = this.dataManagementService.tenantData.sensors;
          this.selectedStations = this.selectedInstallation.stations.filter(st => st.id == this.alert.fatherId);
          this.selectedMeasures = this.sensors.filter(s => s.id == this.alert.measureId);
          this.alert.measureType = 'SENSOR';
          this.selectedMeasureType = this.alert.measureType;
          break;

        default:
          this.selectedMeasures = [this.getMeasureContainer(this.selectedMeasureType).find(m => m.id == +this.alert.measureId)];
      }
      this.onNext();
      //this.setValueConfig(); // j pense zeyda!!
    }
  }

  onChangeAlertType() {
    this.alert.measureType = this.selectedMeasureType;
    this.setValueConfig();
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
    //  this.selectedMeasures.forEach(mesure => this.measureIds.push(mesure.id));
  }

  chooseMeasureType() {
    this.selectedMeasures = [];
    this.alert.measureType = null;
    this.alert.type = null;
  }

  getMeasureContainer(val: String): any[] {
    try {
      if (this.selectedInstallation) {
        switch (val) {
          case 'POINT':
            return orderByField(this.selectedInstallation.points, 'label');
          case 'DEVICE':
            return this.orderByName(this.selectedInstallation.devices);
          case 'DEVICE_FROID':
            return this.orderByName(this.selectedInstallation.deviceFroids);
          case 'GROUP':
            return this.orderByName([...this.selectedInstallation.groupses, ...this.getPhv()]);
          case 'SONDE':
            return this.orderByName(this.selectedInstallation.sondes);
          case 'INPUT':
            return this.orderByName(this.selectedInstallation.inputs);
          case 'PHASE': {
            let phases = this.orderByName(this.selectedInstallation.groupses).flatMap(g => {
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
          }
          default: {
            if (val.startsWith('IO_')) {
              return this.orderByName(this.selectedInstallation
                .ioList.filter(el => el.type == val.replace('IO_', '')));
            }
          }
        }
      }
    } catch (e) { }
    if (this.owner == 'METOS') {
      return this.orderByName(this.sensors);
    }
    return null;
  }

  onChangeInstallation(event) {
    // this.selectedMeasureType = '';
    this.selectedMeasures = [];
    this.selectedStations = [];
  }

  onZoneChange(event?) {
    this.installations = this.dataManagementService.tenantData.zones.find(z => z.idZone == this.selectedZone.idZone).installations;
    this.selectedInstallation = null;
    this.selectedMeasures = [];
    this.selectedStations = [];
  }

  onChangeStations(stations) {
    this.stationIds = new Array();
    this.selectedStations.forEach(
      station => {
        this.stationIds.push(station.id);
      });
  }

  private setValueConfig() {
    if (this.alert.id > 0) { // update
      // this.valueConfig = this.alert.configs.filter(e => e.type != AlertConfigType.WEEK_DAYS && e.type != AlertConfigType.DATE && e.type != AlertConfigType.TIME )[0];
    } else { // create
      switch (this.alert.type) {
        case 'ENERGY':
          this.valueConfig.operator = Operator.MAX;
          this.valueConfig.type = AlertConfigType.ACTIVE_W_DAY;
          break;
        case 'DISCONNECTION':
          this.valueConfig.type = AlertConfigType.DISCONNECTION;
          this.valueConfig.operator = Operator.NONE;
          break;
        case 'VARIATION':
          this.valueConfig.type = AlertConfigType.VARIATION;
          this.valueConfig.operator = Operator.MAX;
          break;
        case 'TEMPERATURE_THRESHOLD':
          this.valueConfig.type = AlertConfigType.TEMPERATURE_THRESHOLD;
          this.valueConfig.operator = Operator.NOT_BETWEEN;
          break;
        case 'SIMPLE':
          this.valueConfig.type = AlertConfigType.VALUE;
          this.valueConfig.operator = Operator.BETWEEN;
          break;
        case 'SIMPLE_VAL':
          this.valueConfig.type = AlertConfigType.VALUE;
          this.valueConfig.operator = Operator.EQUAL;
          break;
        case 'AMPERAGE':
        case 'VOLTAGE':
        case 'POWER':
        case 'DEPHASAGE':
          this.valueConfig.type = AlertConfigType.VALUE;
          this.valueConfig.operator = Operator.MAX;
          break;
        default:
          this.valueConfig.type = AlertConfigType.VALUE;
          this.valueConfig.operator = Operator.MAX;
          break;
      }
    }
    // let tmpConfig: AlertConfiguration[] = this.alert.configs.filter(e => e.type == AlertConfigType.WEEK_DAYS || e.type == AlertConfigType.DATE || e.type == AlertConfigType.TIME);
    // this.alert.configs = tmpConfig;
    if (this.valueConfig != undefined && this.valueConfig != null)
      this.alert.configs.push(this.valueConfig);
  }

  getAlertLabel() {
    switch (this.alert.type) {
      case 'ENERGY':
        return 'ENERGY';
      case 'DISCONNECTION':
        return 'DISCONNECTION';
      case 'VARIATION':
        return 'VARIATION';
      case 'TEMPERATURE_THRESHOLD':
        return 'TEMPERATURE THRESHOLD'
      case 'SIMPLE':
        return this.alert.measureType == 'SONDE' ? 'TEMPERATURE' : '';
      case 'SIMPLE_VAL':
        return this.alert.measureType == 'INPUT' ? 'SIMPLE_VAL' : '';
    }
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

  onReinit() {
    this.alert = new Alert();
  }

  onClose() {
    this.ref.close();
  }

  onNext() {
    this.next = true;
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
