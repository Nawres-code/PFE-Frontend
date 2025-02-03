import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { InstallationDto, TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { DeviceService } from '../../../@core/service/device.service';
import { DropListComponent, DropListEditComponent } from '../../../@core/utils/smartTable/drop-list/drop-list.component';
import { User } from '../../../authenification/credentials';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {


  loading: Boolean;
  private alive: boolean = true;
  public currentUser: User = new User();
  installations: InstallationDto[] = [];
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
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
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
      installationName: {
        title: "Ligne",
        type: 'custom',
        filter: true,
        valuePrepareFunction: (value, row, cell) => {
          // DATA FROM HERE GOES TO renderComponent
          return value.toUpperCase();
        },
        renderComponent: DropListComponent,
        onComponentInitFunction: (instance) => {
          instance.list = this.installations.map(i => {
            return i.name.toUpperCase();
          }).sort();
          instance.placeholder = 'Ligne';
        },
        editor: {
          type: 'custom',
          component: DropListEditComponent,
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();


  constructor(
    private deviceService: DeviceService,
    private dataManagementService: DataManagementService) { }

  ngOnDestroy(): void { this.alive = false; }

  init(tenantData: TenantData) {
    this.installations = [];
    for (let j = 0; j < this.dataManagementService.tenantData.zones.length; j++) {
      let z = this.dataManagementService.tenantData.zones[j];
      for (let i = 0; i < z.installations.length; i++) {
        this.installations.push({ id: z.installations[i].id, name: z.installations[i].name });
        console.log("inst  " + JSON.stringify(this.installations));
      }
    }
    this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
    this.loadAllDevice();
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

  loadAllDevice() {
    this.loading = true;
    this.deviceService.devicesData = [];
    this.deviceService.findAll(+localStorage.getItem("id")).subscribe(device => {
      device.forEach(snd => {
        //if (this.dataManagementService.userHasInstallation(snd.installationId)) {
          this.deviceService.devicesData.push(snd);
        //}
      });
      this.source.load(this.deviceService.devicesData);
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
      };
      this.deviceService.updateDevice(data).subscribe(
        res => {
          event.confirm.resolve(event.newData);
        }
      );
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    var data = {
      "name": event.newData.name,
      "id": event.newData.id,
      "installationId": this.installations.filter(i => i.name.toUpperCase() == event.newData.installationName)[0].id,
      "installationName": event.newData.installationName
    };
    this.deviceService.addDevice(data).subscribe(
      res => {
        res.installationName = data.installationName;
        event.confirm.resolve(res);
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.deviceService.deleteDevice(event.data.id).subscribe(
        (resp) => {
          event.confirm.resolve();
        });
    } else {
      event.confirm.reject();
    }
  }
}