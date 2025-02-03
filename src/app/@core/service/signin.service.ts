import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { Authority, Credentials, User, Action} from '../../authenification/credentials';
import { createAuthorizationHeader } from '../../@core/utils/headers';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DateInterval } from '../data/data';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  disableOrEnaleAccount(id: number): Observable<User> {
    let headers = createAuthorizationHeader();
    return this._http.put<User>(`${dns}accounts/enabled/${id}`, null,{ headers: headers });
  }

  updateAccount(user: User): Observable<User> {
    let headers = createAuthorizationHeader();
    return this._http.put<User>(`${dns}accounts/`, user,{ headers: headers });
  }

  addAccount(user: User): Observable<User> {
    let headers = createAuthorizationHeader();
    return this._http.post<User>(`${dns}accounts/`, user,{ headers: headers });
  }

  deleteAccount(id: number): Observable<User> {
    let headers = createAuthorizationHeader();
    return this._http.delete<User>(`${dns}accounts/${id}`, { headers: headers });
  }

  accountWasDeleted: EventEmitter<User> = new EventEmitter();
  accountWasCreated: EventEmitter<User> = new EventEmitter();
  accountWasChanged: EventEmitter<User> = new EventEmitter();
  account2Update:    EventEmitter<User> = new EventEmitter();


  authorities: Authority[] = null;
  accounts: User[] = null;
  currentUser: User = null;

  constructor(private _http: HttpClient, private helper: JwtHelperService) { }

  login(credentials: Credentials): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http
      .post(dns + 'users/signin', credentials, { headers: headers });
  }

  logout(): Observable<any> {
    this.currentUser = this.helper.decodeToken(localStorage.getItem('token')).user;
    let headers = createAuthorizationHeader();
    return this._http
      .post(dns + 'users/signout/' + this.currentUser.id, {}, { headers: headers });
  }

  getCurrentUser() {
    this._http.get(`${dns}users/me`, { headers: createAuthorizationHeader() }).subscribe(
      (resp: any) => { this.currentUser = resp; }
    );
  }


  getAccounts(): Observable<User[]>{
    let headers = createAuthorizationHeader();
    return this._http
      .get<User[]>(dns + 'accounts', { headers: headers });
   
  }

  getActions(userId: number, dateInterval: DateInterval): Observable<Action[]>{
    let headers = createAuthorizationHeader();
    return this._http
      .post<Action[]>(dns + `accounts/actions/${userId}`, dateInterval, { headers: headers });
  }

  getAuthorities():Observable<Authority[]>  {
    let headers = createAuthorizationHeader();
    return this._http
      .get<Authority[]>(dns + 'accounts/authorities', { headers: headers });
  }
  
  public isRootAdmin() {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.root) {
      return true;
    }
    return false;
  }

  public isHasRole(authority) {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.authorities && !currentUser.root) {
      for (let i = 0; i < currentUser.authorities.length; i++) {
        if (currentUser.authorities[i].name === authority) {
          return true;
        }
      }
    }
    return false;
  }

  refreshToken(token: string) {
      let headers = new HttpHeaders({
        "Content-Type": "application/json"
      });
    return this._http.post(dns + 'users/refreshtoken', {
      refreshToken: token
    }, { headers: headers });
  }
}
