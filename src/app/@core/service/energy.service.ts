import { Injectable } from '@angular/core';
import { createAuthorizationHeader} from '../utils/headers';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { dns } from '../../global.config';
import { ChartEnergyData } from './../data/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {

  constructor(private _http: HttpClient) { }

  getAllRepEnergy(chartEnergyData : ChartEnergyData, period: String, type: string): Observable<any> {
    let headers = createAuthorizationHeader();
    let params={}
    return this._http.post(dns + `energy/${type}/getAll/RepEnergy${period}`, chartEnergyData ,{
      headers : headers
    });
  }

}
