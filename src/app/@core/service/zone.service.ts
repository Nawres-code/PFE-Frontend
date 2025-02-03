import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../utils/headers';
import { dns } from '../../global.config';
import { HttpClient } from '@angular/common/http';
import { ZoneData } from '../data/data';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  zones : ZoneData [] = [];
  constructor(private _http: HttpClient) {
  }

  findAll(tenantId: number): Observable<ZoneData[]> {
    let headers = createAuthorizationHeader();
    return this._http.get<ZoneData[]> (dns + 'zones/' +tenantId, { headers: headers });
  }

  addZone(zone: ZoneData) : Observable<any> {
    let headers = createAuthorizationHeader();
    let options = { headers: headers };
    return this._http.post(dns + 'zones/zone/', zone, options);
  }

  updateZone(zone: ZoneData) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.put(dns + 'zones/zone/', zone, { headers: headers });
  }

  deleteZone(id: number) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(dns + 'zones/zone/' + id, { headers: headers });
  }

  getZoneById(id: string) : Observable<ZoneData> {
    let headers = createAuthorizationHeader();
    return this._http.get<ZoneData>(dns + 'zones/' + id, { headers: headers });
  }
}
