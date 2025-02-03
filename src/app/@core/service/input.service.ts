import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dns } from '../../global.config';
import { InputCategory, Inputs } from '../data/data';
import { createAuthorizationHeader } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  updateInput(input: Inputs) {
    let headers = createAuthorizationHeader();
    return this._http.put<Inputs>(`${dns}inputs/${input.id}`, input, { headers: headers });
  }

  renameCatInput(category: InputCategory){
    let headers = createAuthorizationHeader();
    return this._http.put<Inputs>(`${dns}inputs/categories/${category.id}`, category, { headers: headers });

  }
  constructor(private _http: HttpClient) { }
}
