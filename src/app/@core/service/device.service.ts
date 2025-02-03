import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { Device, DeviceData } from '../data/data';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  devices: Device[] = [];
  devicesData: DeviceData[] = [];

  constructor(private _http: HttpClient) { }

  findAll(tenantId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + 'devices/' + tenantId, { headers: headers });
  }

  addDevice(deviceData: DeviceData): Observable<any> {
    let headers = createAuthorizationHeader();
    let options = { headers: headers };
    return this._http.post(dns + 'devices/device', deviceData, options);
  }

  updateDevice(deviceData: DeviceData): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.put(dns + 'devices/device/' + deviceData.id, deviceData, { headers: headers });
  }

  deleteDevice(id: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.delete(dns + 'devices/device/' + id, { headers: headers });
  }

}
