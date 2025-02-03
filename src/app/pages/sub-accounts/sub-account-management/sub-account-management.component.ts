import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
//import { ModalDirective } from 'ngx-bootstrap/modal';
import { delay, takeWhile } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThrowStmt } from '@angular/compiler';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CheckboxComponent } from '../../../@core/utils/smartTable/checkbox/checkbox.component';
import { SelectedComponent, SelectedEditComponent } from '../../../@core/utils/smartTable/selected/selected.component';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { SubAccountService } from '../../../@core/service/sub-account.service';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-sub-account-management',
  templateUrl: './sub-account-management.component.html',
  styleUrls: ['./sub-account-management.component.scss']
})
export class SubAccountManagementComponent implements OnInit {

  loading: Boolean;
  private alive: boolean = true;
  subAccountSelectionChanged$: EventEmitter<void> = new EventEmitter();

 // @ViewChild("confirmDeleteModal") confirmDeleteModal: ModalDirective;
  owner: string;
  settings = {
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
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        filter: true,
        editable: false
      },
      username: {
        title: "Name",
        type: 'string',
        filter: true,
        editable: false
      },
     enabled: {
        title: "Active",
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
        title: 'Selectionner',
        type: 'custom',
        renderComponent: SelectedComponent,
        editor: {
          type: 'custom',
          component: SelectedEditComponent,
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private toastr: NbToastrService,
    private dataManagementService: DataManagementService,
    private subAccountService: SubAccountService,
    private helper: JwtHelperService,
    private router: Router) {
      this.owner = owner;
      /*if(!this.subAccountService.subAccounts)
          this.subAccountService.init();*/
      this.subAccountService.subAccountsLoaded$
      .pipe(takeWhile(() => this.alive))
      .subscribe( resp =>{ this.loadData();});
      this.loadData();

      this.subAccountSelectionChanged$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(1000))
      .subscribe(resp => {this.router.navigate(["/pages/realtime"]);});
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
  }

  onEditConfirm(event): void {
    var data = {
      "username": event.newData.username,
      "id": event.newData.id,
      "enabled": event.newData.enabled,
      "selected": event.newData.selected
    };
    
    if (data.selected && window.confirm(`Are you sure you want to select ${data.username}?`)) {
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
            // console.log('error: '+JSON.stringify(error));
            this.toastr.danger("Something went wrong!");
            event.confirm.reject();
          });
    } else {
      event.confirm.reject();
    }
  }

}
