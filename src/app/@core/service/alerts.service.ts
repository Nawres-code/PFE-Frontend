import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Alert, ArchiveAlertDto } from '../data/data';
import { createAuthorizationHeader} from '../utils/headers';
import { dns } from '../../global.config';
import { UserAlertFilterDto } from '../data/dataDto';
import { User } from '../../authenification/credentials';
import { AlertType } from '../data/enum';
import { Unit } from '../data/comaparator';

@Injectable({
  providedIn: 'root'
}) 
export class AlertsService {

  alertsSubject = new Subject<Alert[]>();
  alertsParamsSubject = new Subject<any[]>();
  alertFilter: UserAlertFilterDto = new UserAlertFilterDto(); 
  loading : boolean = false;

  constructor(private  _http: HttpClient) {
    this.alertsSubject.next([]);
    this.alertsParamsSubject.next([]);
    this.tlChanged$.emit(null);
    this.popupClosed$.emit(null);
    this.popupOpen$.emit(null);

    // this.findAllAlert(null).subscribe(
    //   alerts => {
    //     this.alertsSubject.next(alerts);
    //   });
   }

   findAllAlert(alertFilter: UserAlertFilterDto): Observable<Alert[]> {
    let headers = createAuthorizationHeader();
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    return this._http.post<Alert[]>
    (`${dns}user-alerts-api/${user.id}/alerts`, alertFilter, {headers: headers});
  }

  // findAllByMesureRange(alertFilter: UserAlertFilterDto): Observable<Alert[]> {
  //   let headers = createAuthorizationHeader();
  //   return this._http.post<Alert[]>(`${dns}user-alerts-api/alerts`, alertFilter, {headers: headers});
  // }

  createAlert(alert: Alert): Observable<void> {
    let headers = createAuthorizationHeader();
    return this._http.post<void>(`${dns}user-alerts-api/alerts/alert`, alert, {headers: headers});
  }

  updateAlert(id: number, alert:Alert): Observable<void> {
    let headers = createAuthorizationHeader();
    return this._http.put<void>(`${dns}user-alerts-api/alerts/${id}`, alert, {headers: headers});
  }

  toggleAlertStatus(id: number, status: boolean): Observable<void> {
    let headers = createAuthorizationHeader();
    return this._http.put<void>(`${dns}user-alerts-api/alerts/${id}/status`, status, {headers: headers});
  }

  deleteAlert(id: number): Observable<void> {
    let headers = createAuthorizationHeader();
    return this._http.delete<void>(`${dns}user-alerts-api/alerts/${id}`, {headers: headers});
  }

  emitAlerts() {
    /*this.findAllByMesureRange(this.alertFilter).subscribe(
      alerts => {
        this.alertsSubject.next(alerts);
      });*/
      this.loading = true;
    this.findAllAlert(this.alertFilter).subscribe({
     next: (alerts) => {
        this.alertsSubject.next(alerts);
        this.loading = false; },
     error: (error)=>{this.loading = false; },
     complete: ()=>{this.loading = false; }});
  }
  getUnit(alertType: AlertType | string):string {
    switch(alertType){
      case AlertType.ENERGY: return Unit.Kwh;
      case AlertType.DISCONNECTION: return '';
      case AlertType.VARIATION: return '%';
      case AlertType.TEMPERATURE_THRESHOLD: return '°C';
      case AlertType.SIMPLE: return '';
      case AlertType.SIMPLE_VAL: return '';
      case AlertType.AMPERAGE: return 'A';
      case AlertType.VOLTAGE: return 'V';
      case AlertType.POWER: return Unit.Watt;
      case AlertType.DEPHASAGE: return '%';
      case AlertType.CALORIFIQUE: return 'm3';
      case AlertType.EAU: return 'm3';
      case AlertType.GAZ: return 'm3';
      default: return '';
    }
  }
  deepClone(alert: Alert): Alert {
    let copy: Alert = new Alert();
    copy.id = alert.id;
    copy.isActive = alert.isActive;
    copy.email = alert.email;
    copy.type = alert.type;
    copy.measureId = alert.measureId;
    copy.measureName = alert.measureName;
    copy.measureType = alert.measureType;
    copy.fatherId = alert.fatherId;
    copy.installationId = alert.installationId;
    copy.zoneId =  alert.zoneId;
    copy.sms = alert.sms;
    copy.pendingPeriod = alert.pendingPeriod;
    copy.message = alert.message;
    alert.configs.forEach(e => copy.configs.push(JSON.parse(JSON.stringify(e))));
    return copy;
  }
   tlChanged$:EventEmitter<string> = new EventEmitter();

   popupClosed$: EventEmitter<number> = new EventEmitter();
   popupOpen$: EventEmitter<number> = new EventEmitter();
   suppId: number = null;

   getAllArchive(userId: number): Observable<ArchiveAlertDto[]> {
      let headers = createAuthorizationHeader();
      return this._http.get<ArchiveAlertDto[]>
      (`${dns}user-alerts-api/${userId}/archive`, {headers: headers});
   } 

   getAlertLabel(alertType, measureType) {
    switch (alertType) {
      case 'ENERGY':
        return 'Energy';
      case 'DISCONNECTION':
        return measureType == 'SONDE'?
        'Sonde hors ligne'
        : measureType == 'GROUP'? 'Group hors ligne':'Hors ligne';
      case 'VARIATION':
      case 'DEPHASAGE':
        return 'Equilibrage de phases';
      case 'TEMPERATURE_THRESHOLD':
        return 'Temperature'
      case 'SIMPLE':
        return measureType == 'SONDE' ? 'TEMPERATURE' : 'Value';
      case 'AMPERAGE':
        return 'Ampérage';
      case 'VOLTAGE':
        return 'Voltage';
      case 'POWER':
        return 'Puissance';
      case 'SIMPLE_VAL':
        return 'Value';
      case 'CALORIFIQUE':
        return 'Calorifique';
      case 'EAU':
        return 'Eau';
      case 'GAZ':
        return 'Gaz';
    }
  }
}
