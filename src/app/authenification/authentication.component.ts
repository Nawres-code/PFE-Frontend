import { Component } from '@angular/core';


@Component({
  selector: 'ngx-auth',
  styleUrls: ['authentication.component.scss'],
  template: `
    <ngx-one-column-footer-layout>
      <router-outlet></router-outlet>
    </ngx-one-column-footer-layout>
  `,
})
export class AuthenticationComponent {
}
