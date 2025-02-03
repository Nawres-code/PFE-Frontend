import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../../@core/utils';

@Component({
  selector: 'ngx-miscellaneous',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class MiscellaneousComponent {
  constructor( private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
  }
}
