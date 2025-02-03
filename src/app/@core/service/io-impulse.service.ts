import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class IoImpulseService {

  constructor(private _http: HttpClient) { }

  renameIo(ioName: string, ioId: number ) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + `io-impulses/${ioId}/rename/${ioName}`, { headers: headers });
  }
}
