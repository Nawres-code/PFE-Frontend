import { HttpHeaders } from '@angular/common/http';

export var contentHeaders = new HttpHeaders();
contentHeaders = contentHeaders.append('Accept', 'application/json');
contentHeaders = contentHeaders.append('Content-Type', 'application/json');


export function createAuthorizationHeader() : HttpHeaders {
  let headers=new HttpHeaders({ "Content-Type": "application/json",
    'Authorization': "Bearer "+localStorage.getItem('token')
  });
  return headers;
}
