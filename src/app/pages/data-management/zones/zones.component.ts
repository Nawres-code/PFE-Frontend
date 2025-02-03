import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { TenantData, Zone, ZoneData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { ZoneService } from '../../../@core/service/zone.service';
import { LayoutService } from '../../../@core/utils';
import { User } from '../../../authenification/credentials';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit, OnDestroy {
  loading: Boolean;
  currentZone: Zone = new Zone;
  private alive: boolean = true;
  public currentUser: User = new User();

  owner: string;
  settings = {
    actions: {
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
      idZone: {
        title: 'ID',
        type: 'string',
        filter: true,
        editable: false,
        addable: false,
      },
      name: {
        title: "Name",
        type: 'string',
        filter: true
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private toastrService: NbToastrService, private zoneService: ZoneService,
    private dataManagementService: DataManagementService,
    private sidebarService: NbSidebarService, private layoutService: LayoutService) {

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
  }

  ngOnDestroy(): void { this.alive = false; }

  init(tenantData: TenantData) {
    this.loadAllZones();
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

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

  loadAllZones() {
    this.loading = true;
    this.zoneService.zones = [];
    this.zoneService.findAll(+localStorage.getItem("id")).subscribe(zones => {
      this.zoneService.zones = zones;
      this.source.load(this.zoneService.zones);
      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }

  onEditConfirm(event): void {
    if (window.confirm('Êtes-vous sûr de vouloir modifier?')) {
      var data = {
        "name": event.newData.name,
        "idZone": event.newData.idZone,
        "tenantId": event.newData.tenantId
      };
      this.zoneService.updateZone(data).subscribe(
        res => {
          event.confirm.resolve(event.newData);
          this.dataManagementService.showToast('success', 'Bien energister');
        }
      );
    } else {
      event.confirm.reject();
      this.dataManagementService.showToast('success', 'N est pas energister');
    }
  }

  onCreateConfirm(event) {
    if (window.confirm('Êtes-vous sûr de vouloir créer?')) {
      var data = {
        "name": event.newData.name,
        "idZone": event.newData.idZone,
        "tenantId": +localStorage.getItem("id")
      };
      this.zoneService.addZone(data).subscribe(
        res => {
          event.confirm.resolve(res);
          this.dataManagementService.showToast('success', 'Bien energister');
        });
    } else {
      event.confirm.reject();
      this.dataManagementService.showToast('success', 'N est pas energister');
    }

  }

  onDeleteConfirm(event): void {
    if (window.confirm('Etes-vous sûr que vous voulez supprimer?')) {
      this.zoneService.deleteZone(event.data.idZone).subscribe(
        () => {
          event.confirm.resolve();
          this.dataManagementService.showToast('success', 'Bien supprimer');
        });
    } else {
      event.confirm.reject();
    }
  }
}
