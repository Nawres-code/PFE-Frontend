import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { delay, takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { SubAccountService } from '../../../@core/service/sub-account.service';
import { LayoutService } from '../../../@core/utils';
import { CheckboxComponent } from '../../../@core/utils/smartTable/checkbox/checkbox.component';
import { SelectedComponent, SelectedEditComponent } from '../../../@core/utils/smartTable/selected/selected.component';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-sub-accounts',
  templateUrl: './sub-accounts.component.html',
  styleUrls: ['./sub-accounts.component.scss']
})
export class SubAccountsComponent implements OnInit {

  loading: Boolean;
  private alive: boolean = true;
  subAccountSelectionChanged$: EventEmitter<void> = new EventEmitter();
  translate = [];

//@ViewChild("confirmDeleteModal") confirmDeleteModal: ModalDirective;
  owner: string;
  settings = null;

  load(){
    this.translateService.get(['SUB_ACC.id', 'SUB_ACC.username', 'SUB_ACC.active', 'SUB_ACC.selected', 
    'SUB_ACC.confirmUpdate', 'SUB_ACC.error', 'SUB_ACC.already'])
    .pipe(takeWhile(() => this.alive))
    .subscribe(resp => {
      this.translate = resp;
      this.settings = {
          add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
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
            add: false,
            delete: false,
            columnTitle: '', // minimize the actions column size
          },
          columns: {
            id: {
              title: resp['SUB_ACC.id'], // 'ID',
              type: 'string',
              filter: true,
              editable: false
            },
            username: {
              title:resp['SUB_ACC.username'], // "Nom d'utilisateur",
              type: 'string',
              filter: true,
              editable: false
            },
           enabled: {
              title: resp['SUB_ACC.active'], //"Active",
              type: 'custom',
              renderComponent: CheckboxComponent,
              filter: false,
              editable: false
      
              /*editor: {
                type: 'custom',
                component: CheckboxEditComponent,
              }*/
            },
            selected:{
              title: resp['SUB_ACC.selected'], //'Selectionné',
              type: 'custom',
              renderComponent: SelectedComponent,
              editor: {
                type: 'custom',
                component: SelectedEditComponent,
              }
            }
          },
        }
   });

   this.subAccountService.subAccountsLoaded$
   .pipe(takeWhile(() => this.alive))
   .subscribe( resp =>{ this.loadData();
     this.currentSub = this.subAccountService.subAccounts.find(c=> c.id == this.subAccountService.currentSub.id);
   });
   this.loadData();
  }
  
 

  source: LocalDataSource = new LocalDataSource();
  currentSub;
  constructor(private toastr: NbToastrService,
    private dataManagementService: DataManagementService,
    public subAccountService: SubAccountService,
    private helper: JwtHelperService,
    private router: Router, private sidebarService:NbSidebarService,
     private layoutService:LayoutService, public translateService: TranslateService, 
     private myTranslateService: MyTranslateService ) { 
      this.load();
      this.myTranslateService.translate$.pipe(takeWhile(() => this.alive))
      .subscribe(()=> {this.load(); });

      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }
    
    this.owner = owner;
      /*if(!this.subAccountService.subAccounts)
          this.subAccountService.init();*/


      this.subAccountSelectionChanged$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(1000))
      .subscribe(resp => {this.router.navigate(["/pages/realtime"]);});

      this.currentSub = subAccountService.subAccounts.find(c=> c.id == this.subAccountService.currentSub.id);
    }

  ngOnDestroy(): void { this.alive = false;  }

  ngOnInit() { }

  loadData() {
      this.loading = true;
      if(this.subAccountService.subAccounts.length<1){
        this.subAccountService.initFromCache();
      }
      this.source.load(this.subAccountService.subAccounts);
      this.loading = false;
      this.currentSub = this.subAccountService.currentSub;
  }

  onEditConfirm(event): void {
    var data = {
      "username": event.newData.username,
      "id": event.newData.id,
      "enabled": event.newData.enabled,
      "selected": event.newData.selected
    };
    
    if (data.selected && window.confirm(`${this.translate['SUB_ACC.confirmUpdate']} ${data.username}?`)) {
      this.subAccountService.loadSubAccount2(
        this.helper.decodeToken(localStorage.getItem('token')).user.adminId, event.newData.id)
      .subscribe(
        resp => {
            this.subAccountService.currentSub = this.helper.decodeToken(resp.token).user;
            event.confirm.resolve(event.newData);
            localStorage.setItem('token', resp.token);
            localStorage.setItem('currentUser', JSON.stringify(this.subAccountService.currentSub));
            localStorage.setItem('id', event.newData.id);
            this.subAccountService.setCurrentSub(this.subAccountService.currentSub.id);
            this.dataManagementService.flush();
            this.dataManagementService.init();
            this.loadData();
            this.subAccountSelectionChanged$.emit();
          },
          error => {
            this.toastr.danger(this.translate['SUB_ACC.error']);
            event.confirm.reject();
          });
    } else {
      event.confirm.reject();
    }
  }

  onSubAccountChnaged(event){
    if(event.id == this.subAccountService.currentSub.id) {
      this.toastr.info(`${event.username} ${this.translate['SUB_ACC.already']}`);
    } else {
      this.currentSub = null;
      if( window.confirm(`${this.translate['SUB_ACC.confirmUpdate']} ${event.username}?`)) {
        this.subAccountService.loadSubAccount2(
          this.helper.decodeToken(localStorage.getItem('token')).user.adminId, event.id)
        .subscribe(
          resp => {
            this.currentSub = event;
              this.subAccountService.currentSub = this.helper.decodeToken(resp.token).user;
              localStorage.setItem('token', resp.token);
              localStorage.setItem('currentUser', JSON.stringify(this.subAccountService.currentSub));
              localStorage.setItem('id', event.id);
              this.subAccountService.setCurrentSub(this.subAccountService.currentSub.id);
              this.dataManagementService.flush();
              this.dataManagementService.init();
              this.subAccountSelectionChanged$.emit();
            }, error => {
              this.toastr.danger(this.translate['SUB_ACC.error']);
            });
      } else { // not confirm
        this.currentSub = this.subAccountService.subAccounts
        .find(c=> c.id == this.subAccountService.currentSub.id);
      }

    } 
}
}
