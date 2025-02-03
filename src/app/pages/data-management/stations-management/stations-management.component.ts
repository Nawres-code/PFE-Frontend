import { Component, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { Station } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { StationService } from '../../../@core/service/station.service';
import { LayoutService } from '../../../@core/utils';
import { SmartTableData } from '../../../@core/utils/smart-table';

@Component({
  selector: 'ngx-stations-management',
  templateUrl: './stations-management.component.html',
  styleUrls: ['./stations-management.component.scss']
})
export class StationsManagementComponent implements OnDestroy {
  private alive: boolean = true;
  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private dataManagementService: DataManagementService, private stationService: StationService,
    private sidebarService:NbSidebarService, private layoutService:LayoutService,
    private translateService:TranslateService,  private myTranslateService: MyTranslateService) { 

      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }
      try {
        dataManagementService.tenantData.zones[0].name;
        this.loadSettings();
      } catch (error) {
        this.dataManagementService.GroupsLoaded$
          .pipe(takeWhile(() => this.alive))
          .subscribe(tenantData => this.loadSettings() );
        this.dataManagementService.init();
      }
      this.myTranslateService.translate$
      .pipe(takeWhile(() => this.alive))
      .subscribe(()=> {this.loadSettings();});
    }
  ngOnDestroy(): void {
    this.alive = false;
  }

  init() {
    this.source = new LocalDataSource(this.dataManagementService.tenantData.zones[0].installations[0].stations );
  }

  onDeleteConfirm(event): void {
    if (window.confirm(`Are you sure you want to delete ${event.data.name}?`)) {
      let selectedId = event.data.id;
      
      let index = this.dataManagementService.tenantData.zones[0].installations[0].stations.findIndex(s => s.id == selectedId);
      if (index > -1) {
        // event.confirm.resolve();
      }
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
   if (window.confirm(`Are you sure you want to edit ${event.newData.name} ?`)) {
     let station: Station = new Station(); 
      station.id = event.newData.id;
      station.description = event.newData.description;
      station.name = event.newData.name;
      station.type = event.newData.type;
      station.x = event.newData.x; 
      station.y = event.newData.y; 
      station.altitude = event.newData.altitude;
      let index = this.dataManagementService.tenantData.zones[0].installations[0].stations.findIndex(s => s.id == station.id);
      if (index > -1) {
        this.stationService.updateSensor(station).subscribe(
          resp => {
            event.confirm.resolve(event.newData);
          });
      }
   } else {
    event.confirm.reject();
  }
  }

  loadSettings(){
    this.translateService.get(['STATION.sn', 'STATION.description', 'STATION.name', 
    'STATION.geoX', 'STATION.geoY', 'STATION.altitude'])
    .pipe(takeWhile(() => this.alive))
    .subscribe(resp => {
      this.settings = { 
        edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true
      },
      actions: {
        add: false,
        delete: false,
        position: 'right',
        columnTitle: '', // minimize the actions column size
      },
      columns: {
        id: {
          title: resp['STATION.sn'], //'S/N',
          type: 'string',
          editable: false,
          filter: true
        },
        description: {
          title: resp['STATION.description'], //'Description',
          type: 'string',
          editable: true,
          filter: true
        },
        name: {
          title: resp['STATION.name'], //'Name',
          type: 'string',
          editable: true,
          filter: true
        },
        x: {
          title: resp['STATION.geoX'],//"Geo.x",
          type: 'number',
          editable: true,
          filter: true
        },
        y: {
          title: resp['STATION.geoY'],
          type: 'number',
          editable: true,
          filter: true
        },
        altitude: {
          title: resp['STATION.altitude'], //"Altitude",
          type: 'string',
          editable: true,
          filter: true
        }
      },
      };
      this.init();
    });
   }
  settings: any = null;
  
}

