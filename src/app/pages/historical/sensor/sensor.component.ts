import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { NavigationEnd, Router } from '@angular/router';
import { NbDateTimePickerComponent, NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { owner } from '../../../global.config';
import { takeWhile, delay } from 'rxjs/operators';
import { Installation, Sensor, Zone } from '../../../@core/data/data';

@Component({
  selector: 'ngx-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnDestroy {

  //select group
  sensors: Sensor[] = Array();
  selectedSensors: Sensor[] = new Array();
  sensorIds: number[] = new Array();

  //date
  startDate: Date = new Date();
  endDate: Date = new Date();

  refreshNow: Date;
  owner: string;
  lastUpdate: Date;
  formExpanded: boolean = true;
  formControl = new FormControl(this.startDate);
  formControl1 = new FormControl(this.endDate);
  alive = true;
  params = undefined;
  measurePlaceholder = 'Select Mesures';

  constructor(public dataManagementService: DataManagementService, private _router: Router,
    private sidebarService: NbSidebarService, private layoutService: LayoutService) {

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
    this.owner = owner;
    //date
    this.endDate.setHours(23, 59, 59, 0);
    this.startDate.setTime(this.startDate.getTime() - 3 * 86400000);
    this.startDate.setHours(0, 0, 0, 0);

    // Fix NbDateTimePickerComponent for @nebular/theme 9.0.0
    NbDateTimePickerComponent.prototype.ngOnInit = function () {
      this.format = this.format || this.buildTimeFormat();
      this.init$.next();
    };



    this._router.events
      .pipe(takeWhile(() => this.alive))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.params = this._router.parseUrl(this._router.url).queryParams;

          try {
            this.init(this.dataManagementService.tenantData.zones);
          } catch (error) { }

          this.dataManagementService.GroupsLoaded$
            .pipe(takeWhile(() => this.alive))
            .pipe(delay(50))
            .subscribe(tenantData => {
              this.init(this.dataManagementService.tenantData.zones);
            });
        }
      });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  init(zones) {
    let k = 0;
    for (let j = 0; j < this.dataManagementService.sensors.length; j++) {
      this.sensors[k] = this.dataManagementService.sensors[j];
      k++;
    }

    try {
      if (this.params['zone']) {

        if (this.dataManagementService.sensors != undefined) {
          if (this.dataManagementService.selectedSensor) {
            this.chooseSensor(
              this.selectedSensors
                .find(i => i.id == this.dataManagementService.selectedSensor.id)
            );
          }
          this.selectedSensors = this.dataManagementService.sensors;
          this.chooseSensor(this.selectedSensors);
        }

        this.params = undefined;
      }
    } catch (error) { }

  }

  chooseSensor(sensor) {
    if (this.selectedSensors != undefined)
      this.selectedSensors = sensor;
    this.sensorIds = new Array();
    let i = 0;
    this.selectedSensors.forEach(sensor => {
      this.sensorIds[i] = Number(sensor.id);
      i++;
    });
  }


  refreshZone() {
    this.formExpanded = true;
    this.lastUpdate = new Date();
  }

}
