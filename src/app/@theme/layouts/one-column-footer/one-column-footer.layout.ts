import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-footer-layout',
  styleUrls: ['./one-column-footer.layout.scss'],
  template: `
    <nb-layout >
      <nb-layout-column class="p-0">
      <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnFooterLayoutComponent {}
