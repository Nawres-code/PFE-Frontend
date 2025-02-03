import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { Station } from '../data/data';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private _http: HttpClient) { }

  updateSensor(station: Station) : Observable<Station> {
    let headers = createAuthorizationHeader();
    return this._http.put<Station>(`${dns}stations/${station.id}`, station, { headers: headers });
  }

  deleteSensor(id: string) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(`${dns}stations/${id}`, { headers: headers });
  }

}
