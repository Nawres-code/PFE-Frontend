import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Installation } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { SigninService } from '../../../@core/service/signin.service';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';
import { Authority, User } from '../../../authenification/credentials';

@Component({
  selector: 'ngx-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit, OnDestroy{

  accounts: User[] = null;
  loading = false;

  template: string;
  installations: Installation[];
  authorities: Authority[];
  alive: boolean = true;
  // ColumnMode = ColumnMode;
  faIcon = FA_ICONS;
  constructor(private signinService: SigninService, private dataManagementService : DataManagementService){
    //translate: TranslateService ) {
    /**event listner for delete account */
    this.signinService.accountWasDeleted
    .pipe(takeWhile(()=>this.alive))
    .subscribe(deletedUser => {
      this.accounts = this.accounts.filter( account => account.id !== deletedUser.id );
      this.signinService.accounts = this.accounts;
    });

    /**event listner for create account */
    this.signinService.accountWasCreated
    .pipe(takeWhile(()=>this.alive))
    .subscribe(createdUser => {
      this.accounts.unshift(createdUser);
      this.signinService.accounts = this.accounts;
    });

  
    /**event listner for update account */
    this.signinService.accountWasChanged
    .pipe(takeWhile(()=>this.alive))
    .subscribe(changedUser => {
      let user = this.signinService.accounts.find(a=> a.id == changedUser.id);
      this.signinService.accounts[this.signinService.accounts.indexOf(user)] = changedUser;
    });
  }

  ngOnInit() {
      this.loading = true;
      if (this.signinService.accounts) {
        this.accounts = this.signinService.accounts;
        this.loading = false;
      } else {
        this.signinService.getAccounts().subscribe(accounts => {
          accounts.forEach(u=> u.enabled = true);
          this.accounts = accounts;
          this.signinService.accounts = accounts;
          this.loading = false;
        });
    }
    if(this.dataManagementService.tenantData.zones.length >0){
      this.installations = this.dataManagementService.tenantData.zones.flatMap(z=> z.installations);
    } else {
      this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id"))
      .subscribe( zones => {
          this.installations = zones.flatMap(z=> z.installations);
        });
    }

    if (this.signinService.authorities != null) {
      this.authorities = this.signinService.authorities;
    } else {
        this.signinService.getAuthorities()
        .subscribe(authorities => {
        this.signinService.authorities = authorities;
        this.authorities = authorities;
      });
    }
  }

  loadAccounts() {
    this.loading = true;
    this.signinService.getAccounts().subscribe(
      accounts => {
        this.accounts = accounts;
        this.signinService.accounts = accounts;
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

  /**
 * search specific group !
 * */
  searchAccount() {
    this.loadAccounts();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
