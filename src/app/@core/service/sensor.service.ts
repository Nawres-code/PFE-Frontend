import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { Sensor, SensorData } from '../data/data';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(private _http: HttpClient) { }

  updateSensor(sensor: Sensor) : Observable<Sensor> {
    let headers = createAuthorizationHeader();
    return this._http.put<Sensor>(`${dns}sensors/${sensor.id}`, sensor, { headers: headers });
  }

  updateSensorCdc(sensor: SensorData) : Observable<Sensor> {
    let headers = createAuthorizationHeader();
    return this._http.put<Sensor>(`${dns}sensors/cdc/${sensor.id}`, sensor, { headers: headers });
  }

  deleteSensor(id: string) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(`${dns}sensors/${id}`, { headers: headers });
  }


  addSensorCdc(sensor: SensorData) : Observable<Sensor> {
    let headers = createAuthorizationHeader();
    return this._http.post<Sensor>(`${dns}sensors/add`, sensor, { headers: headers });
  }
}
