import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../@core/service/signin.service';
import { Credentials } from '../credentials';
import { User } from './../credentials';
import { NavigationEnd, Router } from '@angular/router';
import { version, owner } from '../../global.config';
import { NbGlobalPhysicalPosition, NbSpinnerService, NbToastrService } from '@nebular/theme';
import { DataManagementService } from '../../@core/service/data-management.service';
import { SubAccountService } from '../../@core/service/sub-account.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'ngx-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  credentials: Credentials;
  loading = false;
  public currentUser: User = new User();
  version = '';
  owner: string;
  selectedLanguage: string = undefined;
  constructor(private spinner$: NbSpinnerService, public router: Router, public toastrService: NbToastrService,
    public dataManagementService: DataManagementService,
    private subservice: SubAccountService, private signinService: SigninService, 
    public translate: TranslateService) {
      this.selectedLanguage = localStorage.getItem('lang');
      this.translateLanguageTo(this.selectedLanguage != null? this.selectedLanguage :  this.translate.getLangs()[0]);
    

    this.credentials = new Credentials();
    this.version = version;
    this.owner = owner;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let params = this.router.parseUrl(this.router.url).queryParams;
        if (Object.keys(params).indexOf('logout') > -1 /*&& localStorage.length > 0*/) {
          try {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('id');
              localStorage.removeItem('token');
              localStorage.removeItem('auth-refreshtoken');
               this.dataManagementService.stopAllRt();
               this.dataManagementService.flush();
          } finally {
            let msg= 'bye';
            if(Object.keys(params).indexOf('msg') > -1) {
              msg = params['msg'];
            }
            this.translate.get('LOGIN.'+msg).subscribe(resp=>{
              this.toastrService.primary('', resp, {
                destroyByClick: true,
                position:NbGlobalPhysicalPosition.TOP_RIGHT,
                duration: 3000,
                preventDuplicates: true,
                hasIcon: false
              });
            })
            
            this.router.navigate(["/"]);
        }
      }
      }
    });
    if(this.owner == 'MEKATECHNOAUTH'){
      this.credentials = {login: 'mekatech', password: 'mekatech'};
      this.login();
    }
  }

  ngOnInit() {
    this.spinner$.load();
  }

  login() {

    this.loading = true;

    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }

    this.signinService.login(this.credentials).subscribe(
      currentUser => {
      this.loading = false;
      this.signinService.currentUser = currentUser;
      localStorage.setItem('token', currentUser.token);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('auth-refreshtoken', currentUser.refreshToken)
      try {
        localStorage.setItem('id', currentUser.subAccounts[0].id);
      } catch (error) {
        localStorage.setItem('id', currentUser.id);
      }
      this.subservice.updateMenu();
      this.router.navigate(['/pages']);
    }, (error) => {
      this.translate.get('LOGIN.err').subscribe(res=>{
        this.toastrService.danger(res, 'Alerte!', {
          destroyByClick: true,
          position:NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 10000
        });
      })
        
    });
  }

  translateLanguageTo(lang: string) {
    if(lang != undefined && lang != null) {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }
  
}
