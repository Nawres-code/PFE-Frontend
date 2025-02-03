import { Component, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { DeviceData, Sensor, SensorData, TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { SensorService } from '../../../@core/service/sensor.service';
import { LayoutService } from '../../../@core/utils';
import { SmartTableData } from '../../../@core/utils/smart-table';
import { DropListComponent, DropListEditComponent } from '../../../@core/utils/smartTable/drop-list/drop-list.component';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-sensors-management',
  templateUrl: './sensors-management.component.html',
  styleUrls: ['./sensors-management.component.scss']
})
export class SensorsManagementComponent implements OnDestroy {
  private alive: boolean = true;
  source: LocalDataSource = new LocalDataSource();
  owner: string;
  devices: DeviceData[] = [];

  constructor(private service: SmartTableData, private dataManagementService: DataManagementService,
    private sensorSerivice: SensorService, private sidebarService: NbSidebarService, private layoutService: LayoutService,
    private translateService: TranslateService, private myTranslateService: MyTranslateService) {

    this.owner = owner;
    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }

    if (this.owner == 'CDC') {
      try {
        dataManagementService.tenantData.zones[0].name;
        this.loadCdcSettings();
      } catch (error) {
        this.dataManagementService.GroupsLoaded$
          .pipe(takeWhile(() => this.alive))
          .subscribe(tenantData => this.loadCdcSettings());
        this.dataManagementService.init();
      }
      this.myTranslateService.translate$
        .pipe(takeWhile(() => this.alive))
        .subscribe(() => { this.loadCdcSettings(); });
    } else {
      try {
        dataManagementService.tenantData.zones[0].name;
        this.loadSettings();
      } catch (error) {
        this.dataManagementService.GroupsLoaded$
          .pipe(takeWhile(() => this.alive))
          .subscribe(tenantData => this.loadSettings());
        this.dataManagementService.init();
      }
      this.myTranslateService.translate$
        .pipe(takeWhile(() => this.alive))
        .subscribe(() => { this.loadSettings(); });
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  init() {
    this.source = new LocalDataSource(this.dataManagementService.tenantData.sensors);
  }

  initCdc() {
    this.devices = [];
    for (let j = 0; j < this.dataManagementService.tenantData.zones.length; j++) {
      let z = this.dataManagementService.tenantData.zones[j];
      for (let i = 0; i < z.installations.length; i++) {
        let inst = z.installations[i];
        for (let k = 0; k < inst.devices.length; k++) {

          this.devices.push({ id: inst.devices[k].id, name: inst.devices[k].name });
        }
      }
    }
    this.source = new LocalDataSource(this.dataManagementService.tenantData.sensors);
  }

  onDeleteConfirm(event): void {
    if (window.confirm(`Are you sure you want to delete ${event.data.name}?`)) {
      let selectedId = event.data.id;
      let index = this.dataManagementService.tenantData.sensors.findIndex(s => s.id == selectedId);
      if (index > -1) {
        // event.confirm.resolve();
      }
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm(`Are you sure you want to edit ${event.newData.name}?`)) {
      let sensor: Sensor = new Sensor();
      sensor.id = event.newData.id;
      sensor.groupId = event.newData.groupId;
      sensor.name = event.newData.name;
      sensor.unit = event.newData.unit;
      sensor.aggr = event.newData.aggr;
      sensor.graphType = event.newData.graphType;
      sensor.color = event.newData.color;
      sensor.deviceType = event.newData.deviceType;
      let index = this.dataManagementService.tenantData.sensors.findIndex(s => s.id == sensor.id);
      if (index > -1) {
        this.sensorSerivice.updateSensor(sensor).subscribe(
          resp => {
            event.confirm.resolve(event.newData);
          });
      }
    } else {
      event.confirm.reject();
    }
  }


  loadSettings() {
    this.translateService.get(['SENSOR.name', 'SENSOR.unit', 'SENSOR.aggregation'])
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {

        this.settings = {
          edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
          },
          delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
          },
          actions: {
            add: false,
            delete: false,
            position: 'right',
            columnTitle: '', // minimize the actions column size
          },
          columns: {
            name: {
              title: resp['SENSOR.name'],
              type: 'string',
              editable: true,
              filter: true
            },
            unit: {
              title: resp['SENSOR.unit'],// "Unit",
              type: 'string',
              editable: true,
              filter: true
            },
            aggr: {
              title: resp['SENSOR.aggregation'],
              type: 'string',
              editable: true,
              filter: true
            }
          },
        };
        this.init();
      });
  }


  loadCdcSettings() {
    this.translateService.get(['SENSOR.name'])
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {

        this.settings = {
          add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
          },
          edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
          },
          delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
          },
          actions: {
            columnTitle: '', // minimize the actions column size
          },
          columns: {
            name: {
              title: resp['SENSOR.name'],
              type: 'string',
              editable: true,
              filter: true
            },
            tag: {
              title: "Tag",
              type: 'string',
              editable: true,
              filter: true
            },
            mak: {
              title: "Mak",
              type: 'string',
              editable: true,
              filter: true
            },
            deviceName: {
              title: "Machine",
              type: 'custom',
              filter: true,
              valuePrepareFunction: (value, row, cell) => {
                // DATA FROM HERE GOES TO renderComponent
                return value.toUpperCase();
              },
              renderComponent: DropListComponent,
              onComponentInitFunction: (instance) => {
                instance.list = this.devices.map(i => {
                  return i.name.toUpperCase();
                }).sort();
                instance.placeholder = 'Machine';
              },
              editor: {
                type: 'custom',
                component: DropListEditComponent,
              }
            },
          },
        };
        this.initCdc();
      });
  }
  settings: any = null;



  onEditConfirmCdc(event): void {
    if (window.confirm(`Are you sure you want to edit ${event.newData.name}?`)) {
      let sensor: SensorData = new SensorData();
      sensor.id = event.newData.id;
      sensor.name = event.newData.name;
      sensor.tag = event.newData.tag;
      sensor.mak = event.newData.mak;
      sensor.deviceId = event.newData.deviceId;
      let index = this.dataManagementService.tenantData.sensors.findIndex(s => s.id == sensor.id);
      if (index > -1) {
        this.sensorSerivice.updateSensorCdc(sensor).subscribe(
          resp => {
            event.confirm.resolve(event.newData);
          });
      }
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirmCdc(event) {
    if (window.confirm('Are you sure you want to create?')) {
      var data = {
        "name": event.newData.name,
        "id": event.newData.id,
        "tag": event.newData.tag,
        "mak": event.newData.mak,
        "deviceId": this.devices.filter(i => i.name.toUpperCase() == event.newData.deviceName)[0].id,
        "deviceName": event.newData.deviceName
      };
      data.id = 10+1;
      this.sensorSerivice.addSensorCdc(data).subscribe(
        res => {
          //res.deviceName = data.deviceName;
          event.confirm.resolve(res);
        });

    } else {
      event.confirm.reject();
    }
  }

}
