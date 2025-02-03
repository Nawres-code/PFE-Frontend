import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

@Component({
  selector: 'developpement',
  styleUrls: ['./developpement.component.scss'],
  templateUrl: './developpement.component.html',
})
export class DeveloppementComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
