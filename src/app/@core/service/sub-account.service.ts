import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../../@core/utils/headers';
import { User } from '../../authenification/credentials';
import { dns, owner } from '../../global.config';
import { MENU_ITEMS } from '../../pages/pages-menu';
import { MyTranslateService } from './my-translate.service';

@Injectable({
  providedIn: 'root'
})
export class SubAccountService {

  public subAccountsLoaded$: EventEmitter<User[]> = new EventEmitter();
  public menuIteams = [...MENU_ITEMS];
  currentAdmin: User = new User();
  public currentSub: User = new User();
  public subAccounts: User[] = [];
  constructor(private _http: HttpClient, public helper: JwtHelperService,
    private myTranslateService: MyTranslateService) { }


  setCurrentSub(idSub: number) {
    this.currentSub = this.helper.decodeToken(localStorage.getItem('token')).user;
    this.subAccounts.forEach(a => {
      a.selected = false;
      //a.selected = a.id == idSub ? true : false;
      if (a.id == idSub) {
        a.selected = true;
        // this.currentSub = a;
      }
    });
    this.updateMenu();
  }

  init() {
    try {
      this.currentAdmin = JSON.parse(localStorage.getItem('currentUser'));
      this.currentSub = JSON.parse(localStorage.getItem('currentUser'));
      this.currentAdmin.id = this.currentAdmin.adminId;
      this.updateMenu();
      if (this.currentAdmin.roles.indexOf('ROLE_SUPER_ADMIN') > -1) {
        this.getAllSubAccount(this.currentAdmin.id).subscribe(
          resp => {
            this.subAccounts = resp;
            this.subAccounts.forEach(s => s.enabled = true);
            this.currentSub = JSON.parse(localStorage.getItem('currentUser'));
            this.setCurrentSub(this.currentSub.id);
          });
      }
    } catch (error) { }
  }

  initFromCache() {
    try {
      this.currentAdmin = JSON.parse(localStorage.getItem('currentUser'));
      this.currentSub = JSON.parse(localStorage.getItem('currentUser'));
      this.currentAdmin.id = this.currentAdmin.adminId;
      this.subAccounts = this.currentAdmin.subAccounts;
      this.setCurrentSub(this.currentSub.id);
    } catch (error) {
      // console.log(JSON.stringify(error))
    }
  }

  getAllSubAccount(adminId: number): Observable<User[]> {
    let headers = createAuthorizationHeader();
    return this._http
      .get<User[]>(`${dns}users/${adminId}/subaccounts`, { headers: headers });
  }

  loadSubAccount(id: number, subId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get<any>(`${dns}users/${id}/subaccounts/loadData/${subId}`, { headers: headers });
  }

  loadSubAccount2(id: number, subId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .post<any>(`${dns}users/${id}/subaccounts/loadData/${subId}`,
        { refreshToken: localStorage.getItem('auth-refreshtoken') },
        { headers: headers });
  }

  updateMenu() {
    this.menuIteams = [...MENU_ITEMS];
    let user = JSON.parse(localStorage.getItem('currentUser'));

    // super admin
    try {
      if (user.roles.indexOf('ROLE_SUPER_ADMIN') > -1 && !owner.includes('KASSAB')) {
        let username;
        try {
          username = this.subAccounts.find(u => u.id == +localStorage.getItem('id')).username;
        } catch (error) {
          username = this.currentSub.username
        }
        this.menuIteams.splice(0, 0,
          {
            title: username.toUpperCase() + '',
            icon: 'cube',
          });

        this.menuIteams.splice(this.menuIteams.length - 1, 0, {
          title: 'Administration',
          icon: 'person-outline',
          link: '/pages/sub-accounts',
          data: 'administration'
        });

        if (user.id == 31 && owner == 'ANME') {
          this.menuIteams.splice(6, 0,
            {
              title: 'Various',
              icon: 'layers-outline',
              link: '/pages/divers',
              data: 'various'
            }
          );
        }
      } else if (user.id == 31 && owner == 'ANME') {
        this.menuIteams.splice(4, 0,
          {
            title: 'Divers',
            icon: 'layers-outline',
            link: '/pages/divers',
            data: 'various'
          }
        );
      } else if (user.roles.indexOf('ROLE_SUPER_ADMIN') > -1) {
        this.menuIteams = this.menuIteams.filter(item => item.data != 'alerts' && item.data != 'settings');
      }

      if (user.roles.indexOf('ROLE_SUPER_ADMIN') > -1 && owner == 'CDC') {
        this.menuIteams = this.menuIteams.filter(item => item.data != 'alerts');
      }


      if (user.roles.indexOf('ROLE_CONTROL') > -1) {
        this.menuIteams = this.menuIteams.filter(item => item.data != 'engineering' && item.data != 'report' && item.data != 'alerts');
        this.menuIteams.splice(2, 0,
          {
            title: 'Planification',
            icon: 'plus-outline',
            link: '/pages/planning',
            data: 'planning'
          }
        );
      }

    } catch (error) {

    }
    this.myTranslateService.menu = this.menuIteams;
    this.myTranslateService.translateMenu();
  }


}
