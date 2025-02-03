import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../@core/service/data-management.service';
import { MyTranslateService } from '../@core/service/my-translate.service';
import { SubAccountService } from '../@core/service/sub-account.service';
import { User } from '../authenification/credentials';
import { owner } from '../global.config';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl:'pages.component.html',
})
export class PagesComponent  implements OnDestroy {
  owner;
  user: User;
  alive: boolean  = true;
  constructor(private dataManagementService: DataManagementService,
     public subAccountService: SubAccountService,
      public myTranslateService: MyTranslateService, 
     public translateService: TranslateService) {
    this.dataManagementService.init();
    this.subAccountService.init();
    this.owner = owner;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.myTranslateService.translate$.pipe(takeWhile(() => this.alive))
    .subscribe(()=> this.myTranslateService.translateMenu());
    this.myTranslateService.translate$.emit();
    
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  
  isSuperAdmin() {
    return this.user.roles.indexOf('ROLE_SUPER_ADMIN') > -1;
  }

  
}
