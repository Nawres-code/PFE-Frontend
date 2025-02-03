import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dns } from '../../global.config';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
 groupsList: any[] = [];
  constructor(private _http: HttpClient) { }

  renameGroup(groupName: string, groupId: number ) : Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.get(dns + `groups/group/${groupId}/${groupName}`, { headers: headers });
  }
}
