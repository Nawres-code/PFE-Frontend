import { Injectable } from '@angular/core';
import { createAuthorizationHeader} from '../utils/headers';
import { HttpClient, } from '@angular/common/http';
import { dns } from '../../global.config';
import{ ChartDetailsData, ChartTemperatureData, ChartPointData, 
  ChartGazData, ChartSensorData, ChartStationData, ChartInputData, ChartData} from './../data/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private _http: HttpClient) { }

  getAllDetailsPhases(chartDetailsData : ChartDetailsData, period) : Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/phases"+`/${period}` , chartDetailsData  ,{
      headers : headers
    });
  }

  getAllDetailsGroups(chartDetailsData : ChartDetailsData, period) : Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/groups"+`/${period}` , chartDetailsData  ,{
      headers : headers
    });
  }

  getAllDetailsTemperature(chartTemperatureData :ChartTemperatureData, period): Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/temperatures"+`/${period}` , chartTemperatureData  ,{
      headers : headers
    });
  }

  getAllDetailsTemperature30M(chartTemperatureData :ChartTemperatureData): Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/temperatures30M" , chartTemperatureData  ,{
      headers : headers
    });
  }

  getAllDetailsPoint(chartPointData :ChartPointData): Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/points" , chartPointData  ,{
      headers : headers
    });
  }


  getAllDetailsGaz(chartGazData :ChartGazData): Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/gaz" , chartGazData  ,{
      headers : headers
    });
  }

  getAllDetailsSensors(chartSensorData: ChartSensorData) : Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/sensors" , chartSensorData  ,{
      headers : headers
    });
  }

  getAllDetailsStations(chartStationData: ChartStationData) : Observable <any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/stations" , chartStationData  ,{
      headers : headers
    });
  }

  getAllDetailsInput(chartInput: ChartInputData, period: string) {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/inputs"+`/${period}` , chartInput  ,{
      headers : headers
    });
  }

  getAllDetailsIO(chartData: ChartData, period: String) {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + "details/ios"+`/${period}` , chartData  ,{
      headers : headers
    });
  }
}
