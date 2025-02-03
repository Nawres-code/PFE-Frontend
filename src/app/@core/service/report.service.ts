import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateInterval, ReportDto } from "../data/data";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { createAuthorizationHeader } from '../utils/headers';
import { dns } from '../../global.config';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
 

  constructor(private _http: HttpClient, private datePipe: DatePipe) { }

  getRepport(reportDto: ReportDto): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .post(dns + 'generateReport?timeDiff=' + (new Date().getTimezoneOffset()), reportDto, {
        headers: headers, responseType: 'blob' as 'json'
      });
  }

getRepportAnnual(timeRange : DateInterval, type?: string): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .post(dns + 'generateAnnualReport?timeDiff=' + (new Date().getTimezoneOffset())+'&type='+type , timeRange ,{
        headers: headers, responseType: 'blob' as 'json'
      });
  }

  getMonthlyRepport(report: ReportDto): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .post(dns + 'generateMonthlyReport?timeDiff=' + (new Date().getTimezoneOffset()), report, {
        headers: headers, responseType: 'blob' as 'json'
      });
  }

  getIssatMonthlyRepport(reportType: string, date: Date, idGroup?: number):  Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .post(dns + 'generateIssatReport?timeDiff=' + (new Date().getTimezoneOffset()), {reportType: reportType, Date: date, idGroup: idGroup}, {
        headers: headers, responseType: 'blob' as 'json'
      });
  }
  
}
