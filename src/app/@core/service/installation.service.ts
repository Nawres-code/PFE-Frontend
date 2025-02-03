import { Injectable } from '@angular/core';
import { Installation, InstallationData } from '../data/data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../utils/headers';
import { dns } from '../../global.config';
import { InstallationRtDto } from '../data/dataRtDto';

@Injectable({
  providedIn: 'root'
})
export class InstallationService {
  installations : Installation [] = [];
  installationsData : InstallationData [] = [];

  constructor(private _http: HttpClient){ }

  findAll(tenantId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + 'installations/' +tenantId, { headers: headers });
  }

  updateInsallation(installationsData : InstallationData) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.put(dns + 'installations/installation/' + installationsData.id, installationsData, { headers: headers });
  }

  addInstallation(installationData: InstallationData) : Observable<any> {
    let headers = createAuthorizationHeader();
    let options = { headers: headers };
    return this._http.post(dns + 'installations/installation', installationData, options);
  }

  deleteInstallation(id: number) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(dns + 'installations/installation/' + id, { headers: headers });
  }  
}
