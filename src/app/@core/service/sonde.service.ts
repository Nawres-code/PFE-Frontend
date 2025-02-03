import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../utils/headers';
import { dns } from '../../global.config';
import { HttpClient } from '@angular/common/http';
import { Sonde, SondeData } from '../data/data';

@Injectable({
  providedIn: 'root'
})
export class SondeService {

  sondes : SondeData [] = [];

  constructor(private _http: HttpClient) {
    
  }

  findAll(tenantId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + 'sonde/allSonde/' +tenantId, { headers: headers });
  }

  addSonde(sonde: SondeData) : Observable<any> {
    let headers = createAuthorizationHeader();
    let options = { headers: headers };
    return this._http.post(dns + 'sonde/add', sonde, options);
  }

  updateSonde(sonde: SondeData) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.put(dns + 'sonde/update', sonde, { headers: headers });
  }

  deleteSonde(id: number) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(dns + 'sonde/' + id, { headers: headers });
  }

  getSondeById(id: string) : Observable<SondeData> {
    let headers = createAuthorizationHeader();
    return this._http.get<SondeData>(dns + 'sonde/' + id, { headers: headers });
  }
}
