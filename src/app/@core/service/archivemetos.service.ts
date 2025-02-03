import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../utils/headers';
import { dns } from '../../global.config';

@Injectable({
  providedIn: 'root'
})
export class ArchivemetosService {

  constructor(private _http: HttpClient, private datePipe: DatePipe) { }

  getAllRtSensors(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + 'realtime/getAll/sensor', {
      headers : headers
    });
  }

  getSensorsHistory(stationId: string, sensorIds: string[], from: Date, to: Date ): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.post(`${dns}archiveMetos/stations/${stationId}/sensors?startTime=${this.datePipe.transform(from,'yyyy-MM-dd HH:mm')}&endTime=${this.datePipe.transform(to,'yyyy-MM-dd HH:mm')}`, sensorIds,{
      headers : headers
    });
  }

}
