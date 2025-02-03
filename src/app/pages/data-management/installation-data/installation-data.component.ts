import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../authenification/credentials';
import { LocalDataSource } from 'ng2-smart-table';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { TenantData, ZoneData } from '../../../@core/data/data';
import { InstallationService } from '../../../@core/service/installation.service';
import { owner } from '../../../../app/global.config';
import { take, takeWhile } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { CheckboxComponent, CheckboxEditComponent } from '../../../@core/utils/smartTable/checkbox/checkbox.component';
import { DropListComponent, DropListEditComponent } from '../../../@core/utils/smartTable/drop-list/drop-list.component';

@Component({
  selector: 'ngx-installation-data',
  templateUrl: './installation-data.component.html',
  styleUrls: ['./installation-data.component.scss']
})
export class InstallationDataComponent implements OnInit, OnDestroy {

  loading: Boolean;
  private alive: boolean = true;
  public currentUser: User = new User();
  zones: ZoneData[] = [];
  owner: string;
  settings = {
    actions: {
      delete: false,
      columnTitle: '', // minimize the actions column size
    },
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
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        filter: true,
        editable: false,
        addable: false
      },
      name: {
        title: "Nom",
        type: 'string',
        filter: true
      },
      gpsLat: {
        title: "Latitude",
        type: 'string',
        filter: true
      },
      gpsLon: {
        title: "Longitude",
        type: 'string',
        filter: true
      },
      zoneName: {
        title: "Site",
        type: 'custom',
        filter: true,
        valuePrepareFunction: (value, row, cell) => {
          // DATA FROM HERE GOES TO renderComponent
          return value.toUpperCase();
        },
        renderComponent: DropListComponent,
        onComponentInitFunction: (instance) => {
          instance.list = this.zones.map(i => i.name.toUpperCase()).sort();
          instance.placeholder = 'Machine';
        },
        editor: {
          type: 'custom',
          component: DropListEditComponent,
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();


  constructor(private toastr: NbToastrService,
    private installationService: InstallationService,
    public dataManagementService: DataManagementService) { }

  ngOnDestroy(): void { this.alive = false; }

  init(tenantData: TenantData) {
    this.zones=[];
    for (let j = 0; j < this.dataManagementService.tenantData.zones.length; j++) {
      let z = this.dataManagementService.tenantData.zones[j];
          this.zones.push({ idZone: z.idZone, name: z.name });
    }
    //this.zones = this.dataManagementService.tenantData.zones.map(
      //z => { return { idZone: z.idZone, name: z.name }; });
    this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
    this.loadAllInstallation();
  }
  ngOnInit(): void {

    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init(this.dataManagementService.tenantData);
    } catch (error) { }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .subscribe(tenantData => {
        this.init(tenantData);
      });

    this.owner = owner;
  }

  loadAllInstallation() {
    this.loading = true;
    this.installationService.installationsData = [];
    this.installationService.findAll(+localStorage.getItem("id")).subscribe(installation => {
      installation.forEach(snd => {
        if (this.dataManagementService.userHasInstallation(snd.id)) {
          this.installationService.installationsData.push(snd);
        }
      });
      this.source.load(this.installationService.installationsData);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit?')) {
      var data = {
        "name": event.newData.name,
        "id": event.newData.id,
        "gpsLat": event.newData.gpsLat,
        "gpsLon": event.newData.gpsLon,
        "enabled": event.newData.enabled,
        "zoneId": this.dataManagementService.selectedZone.idZone,
        // this.zones.filter(i=>i.name.toUpperCase() == event.newData.zoneName)[0].idZone,
        // "zoneName": event.newData.zoneName
      };
      this.installationService.updateInsallation(data).subscribe(
        res => {
          event.confirm.resolve(event.newData);
          this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id"))
            .pipe(take(1))
            .subscribe(res => this.dataManagementService.tenantData.zones = res);
        }
      );
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    // console.log("On create");
    var data = {
      "name": event.newData.name,
      "id": event.newData.id,
      "gpsLat": event.newData.gpsLat,
      "gpsLon": event.newData.gpsLon,
      "enabled": event.newData.enabled,
      "zoneId": this.zones.filter(i => i.name.toUpperCase() == event.newData.zoneName)[0].idZone,
      "zoneName": event.newData.zoneName
    };
    this.installationService.addInstallation(data).subscribe(
      res => {
        res.zoneName = data.zoneName;
        event.confirm.resolve(res);
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.installationService.deleteInstallation(event.data.id).subscribe(
        (resp) => {
          event.confirm.resolve();
        });
    } else {
      event.confirm.reject();
    }
  }
}