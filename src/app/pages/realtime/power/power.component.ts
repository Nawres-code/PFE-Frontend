import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { PowerActionComponent } from './power-action/power-action.component';
import { delay, takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})

export class PowerComponent implements OnInit, OnDestroy {
  private alive = true;

  owner: string;
  columns = [];
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      installationId: {
        title: 'History',
        type: 'custom',
        renderComponent: PowerActionComponent,
        filter: false,
        editable: false,
      },
      zone: {
        title: 'Zone',
        type: 'string'
      },
      installation: {
        title: 'Installation',
        type: 'string'
      },
      dateInstDto: {
        title: 'Date',
        type: 'string'
      },
      powerInst: {
        title: 'Power Installation ',
        type: 'string'
      },
    }
  };



  ngOnDestroy() {
    this.alive = false;
  }

  source: LocalDataSource = new LocalDataSource();
  constructor(private dataManagementService: DataManagementService, private _router: Router, public datepipe: DatePipe, private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(50))
      .subscribe(tenantData => { this.refreshStruct(); });

    this.dataManagementService.DataLoaded$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(50))
      .subscribe(() => this.refreshData());

  }

  ngOnInit() {
    this.refreshStruct();
    this.refreshData();
  }

  refreshStruct() {
    const arr: string[] = this.dataManagementService.tenantData.zones
      .flatMap(z => z.installations.flatMap(i => i.groupses)).map(g => g.name.toUpperCase());
    const columns = [...new Set(arr)].sort();
    columns.forEach(c => this.settings.columns[c] = { title: c, type: 'string' });
    this.columns = columns;
    this.settings = Object.assign({}, this.settings);
  }

  refreshData() {
    let data = [];
    this.dataManagementService.tenantData.zones.forEach(zone => {
      zone.installations.forEach(inst => {
        let item = {};
        inst.groupses.forEach(g => {
          item['installationId'] = inst.id;
          item['zone'] = zone.name;
          item['installation'] = inst.name;
          try {
            item['dateInstDto'] = this.datepipe.transform(this.dataManagementService.dataRtDto.zonesRtDto[zone.idZone].time, 'yyyy-MM-dd HH:mm:ss');
          } catch (error) {
            item['dateInstDto'] = '--';
          }
          try {
            item['powerInst'] = (this.dataManagementService.dataRtDto.zonesRtDto[zone.idZone].installationsRtDto[inst.id].iPower).toFixed(2);
          } catch (error) {
            item['powerInst'] = '--';
          }
          this.columns.forEach(c => {
            if (g.name.toUpperCase() == c) {
              try {
                item[c] = (this.dataManagementService.dataRtDto.zonesRtDto[zone.idZone].installationsRtDto[inst.id].groupsRtDto[g.id].iPower).toFixed(2);
              } catch (error) {
                item[c] = '--';
              }
            }
          })
        });
        // other groups
        this.columns.forEach(c => {
          if (item[c] == undefined) {
            item[c] = '--';
          }
        });
        data.push(item);
      });
    });
    this.source.load(data);
  }

}
