import { Component, OnInit } from '@angular/core';
import { DataManagementService } from '../../../../../@core/service/data-management.service';

@Component({
  selector: 'ngx-popup-desc',
  templateUrl: './popup-desc.component.html',
  styleUrls: ['./popup-desc.component.scss']
})
export class PopupDescComponent implements OnInit {

  title: string;

  constructor(public dataManagementService: DataManagementService) { }

  ngOnInit() {
  }

  /*selectGroup() {
    for (let gorup of this.dataManagementService.selectedInstallation.groupses) {
      return gorup.name;
    }
  }*/
}
