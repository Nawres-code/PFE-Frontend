import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators';
import { TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { GroupsService } from '../../../@core/service/groups.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { LayoutService } from '../../../@core/utils';
import { orderByField } from '../../../@core/utils/global/order';
import { User } from '../../../authenification/credentials';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.scss']
})
export class GroupsManagementComponent implements OnInit, OnDestroy {

  loading: Boolean;
  private alive: boolean = true;
  public currentUser: User = new User();
  owner: string;
  translateValues = new Map();
  
  loadSettings(){

    this.translateService.get([...[,'GROUP.id','GROUP.name','GROUP.type', 'GROUP.General', 'GROUP.Sous_general']])
    .pipe(takeWhile(() => this.alive))
    .subscribe(resp => {
      this.translateValues.set('General', resp['GROUP.General']);
      this.translateValues.set('Sous_general', resp['GROUP.Sous_general']);

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
            title: resp['GROUP.id'], //'ID',
            type: 'string',
            filter: true,
            editable: false,
            addable: false
          },
          name: {
            title: resp['GROUP.name'],//"Name",
            type: 'string',
            filter: true
          },
         
          type: {
             title: resp['GROUP.type'],//"Type",
             type: 'string',
             filter: true,
             editable: false,
             addable: false
          }
        },
      };
    });
    this.loadAllData();
   }
  settings: any = null;
  

  source: LocalDataSource = new LocalDataSource();

  constructor(private toastr: NbToastrService,
    private dataManagementService: DataManagementService,
    private groupsService: GroupsService,
    private sidebarService:NbSidebarService, private layoutService:LayoutService, 
    private translateService:TranslateService,  private myTranslateService: MyTranslateService) { 
      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }
    }

  ngOnDestroy(): void { this.alive = false;  }

  init(tenantData: TenantData) {
    this.loadSettings();
    this.myTranslateService.translate$
    .pipe(takeWhile(() => this.alive))
    .subscribe(()=> {this.loadSettings();});
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

  loadAllData() {
    this.loading = true;
      this.source.load(this.orderByName(this.dataManagementService.tenantData.zones
        .flatMap(z=> z.installations)
        .flatMap(i=>i.groupses)
        // .concat(this.dataManagementService.tenantData.zones
        //   .flatMap(z=> z.installations)
        //   .flatMap(i=>i.provider)
        //   .flatMap(p=>p.groupses))

          .map(gr => {
            let type: string = this.translateValues.get(gr.type+"");
            return {id: gr.id, name: gr.name, type:type? type: gr.type};}))
          );
      this.loading = false;
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit?')) {
      var data = {
        "name": event.newData.name,
        "id": event.newData.id,
        "type": event.newData.type,
      };
      this.groupsService.renameGroup(data.name,data.id).subscribe(
        res => {
          this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id"))
          .subscribe(res => {
            this.dataManagementService.tenantData.zones = res;
            event.confirm.resolve(data);
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