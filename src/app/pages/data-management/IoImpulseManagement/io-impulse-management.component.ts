import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { owner } from '../../../../app/global.config';
import { TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { IoImpulseService } from '../../../@core/service/io-impulse.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { LayoutService } from '../../../@core/utils';
import { orderByField } from '../../../@core/utils/global/order';
import { User } from '../../../authenification/credentials';

@Component({
  selector: 'ngx-io-impulse-management',
  templateUrl: './io-impulse-management.component.html',
  styleUrls: ['./io-impulse-management.component.scss']
})
export class IoImpulseManagementComponent implements OnInit, OnDestroy {

  loading: Boolean;
  private alive: boolean = true;
  public currentUser: User = new User();
  owner: string;

  loadSettings(){
    this.translateService.get([...[,'IO_IMPULSE.id','IO_IMPULSE.name',
    'IO_IMPULSE.type','IO_IMPULSE.category', 'IO_IMPULSE.General', 'IO_IMPULSE.Sous_general', 
    'IO_IMPULSE.CALORIFIQUE','IO_IMPULSE.EAU','IO_IMPULSE.GAZ']])
    .pipe(takeWhile(() => this.alive))
    .subscribe(resp => {
      this.translateValues.set('General', resp['IO_IMPULSE.General']);
      this.translateValues.set('sous_general', resp['IO_IMPULSE.Sous_general']);
      this.translateValues.set('GAZ', resp['IO_IMPULSE.GAZ']);
      this.translateValues.set('EAU', resp['IO_IMPULSE.EAU']);
      this.translateValues.set('CALORIFIQUE', resp['IO_IMPULSE.CALORIFIQUE']);
      this.settings = {
       
    actions: {
      add: false,
      delete: false,
      columnTitle: '', // minimize the actions column size
    },
    
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    
    columns: {
      id: {
        title: resp['IO_IMPULSE.id'],// 'ID',
        type: 'string',
        filter: true,
        editable: false,
        addable: false
      },
      name: {
        title: resp['IO_IMPULSE.name'],//  'Name',//"Nom",
        type: 'string',
        filter: true
      },
     
      type: {
         title: resp['IO_IMPULSE.type'],//"Type",
         type: 'string',
         filter: true,
         editable: false,
         addable: false
      },
      category: {
        title: resp['IO_IMPULSE.category'],//"Category",
        type: 'string',
        filter: true,
        editable: false,
        addable: false
     }
    },};
    });
      
   }
  settings: any = null;

  source: LocalDataSource = new LocalDataSource();
  translateValues = new Map();


  constructor(private toastr: NbToastrService,
    private ioIpulseService: IoImpulseService,
    private dataManagementService: DataManagementService,
    private sidebarService:NbSidebarService, private layoutService:LayoutService,
     private translateService:TranslateService, private myTranslateService: MyTranslateService) { 
      this.loadSettings();
      this.myTranslateService.translate$.pipe(takeWhile(() => this.alive))
      .subscribe(()=> {this.loadSettings(); this.loadAllInstallation();});

      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      } }

  ngOnDestroy(): void { this.alive = false;  }

  init(tenantData: TenantData) {
      this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
      this.loadAllInstallation();
  }

  ngOnInit(): void {
    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init(this.dataManagementService.tenantData);
    }catch(error){ } 

      this.dataManagementService.GroupsLoaded$
        .pipe(takeWhile(() => this.alive))
        .subscribe(tenantData => {
          this.init(tenantData);
        });
    
    this.owner = owner;
  }

  loadAllInstallation() {
    this.loading = true;
      this.source.load(this.orderByName(this.dataManagementService.tenantData.zones
        .flatMap(z=> z.installations)
        .flatMap(i=>i.ioList)
        .map(ioItem=> {
          let type = this.translateValues.get(ioItem.type);
          let category = this.translateValues.get(ioItem.category);
          return {id:ioItem.id, name:ioItem.name, type: type? type:ioItem.type, category: category? category:ioItem.category};})));
    this.loading = false;
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit?')) {
      var data = {
        "name": event.newData.name,
        "id": event.newData.id,
        "type": event.newData.type,
        "category": event.newData.category,
      };
      this.ioIpulseService.renameIo(data.name, data.id).subscribe(
        res => {
          this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id"))
          .subscribe(res => {
            event.confirm.resolve(data);
            this.dataManagementService.tenantData.zones = res;
            this.dataManagementService.init(true);
          });
        });
    } else {
      event.confirm.reject();
    }
  }

  orderByName(array: any[]){
    return orderByField(array, 'name');
  }
}