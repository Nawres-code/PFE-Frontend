import { Component, ElementRef, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { NbMediaBreakpoint } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import Timer = NodeJS.Timer;
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ArchivemetosService } from '../../../../@core/service/archivemetos.service';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { GraphService } from '../../../../@core/service/graph.service';
import { Installation, Sensor, Station, TenantData } from '../../../../@core/data/data';
import { GraphEntry } from '../../../../@core/data/comaparator';
import { MapService } from '../../../../@core/service/map.service';
import { interval } from 'rxjs';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-datatable-left',
  templateUrl: './datatable-left.component.html',
  styleUrls: ['./datatable-left.component.scss'],
  animations: [
    trigger(
      'searchAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out',
              style({ height: 32, opacity: 1 }))
          ]
        )
      ]
    )
  ]
})
export class DatatableLeftComponent implements OnDestroy {

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  expended: boolean = true;
  rtSensors: Map<number, any> = new Map();
  search: any = { name: '' };
  stationSearch: any = { name: '' };
  showSearchform: boolean = false;

  private alive: boolean = true;
  private liveReloadingRT: Timer;

  @ViewChild("sSearch") sensorSearch: ElementRef;
  @ViewChildren('item') accordion;
  faIcon = FA_ICONS;
  constructor(
    private metosService: ArchivemetosService,
    public dataManagementService: DataManagementService,
    public mapService: MapService,
    private _router: Router, private graphService: GraphService) {
    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.onGroupLoaded();
    } catch (error) {
      this.dataManagementService.init();
    }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .subscribe(tenantData => this.onGroupLoaded(tenantData));

    this.getAllRtMetos();
    const s = interval(60000);
    s.pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.getAllRtMetos();
      });
  }

  onGroupLoaded(tenantData?: TenantData) {
    this.mapService.markers = new Map();
    this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
    this.dataManagementService.selectedInstallation = this.dataManagementService.selectedZone.installations[0];

    this.dataManagementService.tenantData.zones
      .flatMap(z => z.installations)
      .flatMap(i => i.stations)
      .map(station => {
        this.updateMarker(station);
      });
      // console.log()
  }

  getAllRtMetos() {
    this.metosService.getAllRtSensors().subscribe(res => {
      this.rtSensors = res;
    })
  }

  updateMarker(s: Station) {
    if (s.x && s.y)
      this.mapService.addMarker(s.id, s.y, s.x, this.mapService.getPopupContent(s));
  }

  selectStation(i: Installation, c: Station) {
    this.dataManagementService.selectedInstallation = i;
    this.dataManagementService.selectedStation = c;
    this.mapService.openStationPopup(c);
  }

  toggle() {
    if (this.expended) {
      this.accordion.forEach(a => a.close());
    } else {
      this.accordion.forEach(a => a.open());
    }
    this.expended = !this.expended;
  }

  getSensorInfo(id: string): Sensor {
    return this.dataManagementService.tenantData.sensors.find(s => s.id == id);
  }

  selectedCompartor(sensorId: string) {
    let graphEntry: GraphEntry = new GraphEntry();
    graphEntry.installationName = this.dataManagementService.tenantData.zones[0].installations[0].name;
    graphEntry.stationId = this.dataManagementService.selectedStation.id;
    graphEntry.sensorIds = [sensorId];
    graphEntry.status = false;
    let endDate: Date = new Date();
    let startDate: Date = new Date();
    startDate.setTime((new Date().getTime() - 2 * 86400000));
    endDate.setTime(new Date().getTime() + 3600000);
    this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    this._router.navigate(['/pages/historical/comparator']);
  }

  addSensorName(array: any[]) {
    try {
      return array.map(
        rt => {
          rt['name'] = this.getSensorInfo(rt.sensorId).name;
          return rt;
        });
    } catch (e) {
      // console.log(e);
      return [];
    }

  }

  toggleSearh() {
    this.showSearchform = !this.showSearchform;
    if (this.showSearchform) {
      setTimeout(() => { // this will make the execution after the above boolean has changed
        this.sensorSearch.nativeElement.focus();
      }, 0);
    }
  }

  ngOnDestroy() {
    this.alive = false;
    if (this.liveReloadingRT)
      clearTimeout(this.liveReloadingRT);
  }

  isRt(): boolean {
    try {
      return Object.keys(this.rtSensors).length > 0;
    } catch (error) {
      return false
    }
  }

}
