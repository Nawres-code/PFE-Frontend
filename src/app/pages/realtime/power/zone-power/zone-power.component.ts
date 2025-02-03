import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Installation, Zone } from '../../../../@core/data/data';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { owner } from '../../../../global.config';

@Component({
  selector: 'ngx-zone-power',
  templateUrl: './zone-power.component.html',
  styleUrls: ['./zone-power.component.scss']
})
export class ZonePowerComponent implements OnInit {

  installation: Installation = new Installation;
  zone: Zone = new Zone;
  owner : string;

  items = [
    { title: 'History', value: 1 },
    { title: 'Details', value: 2 },
    { title: 'Compare', value: 3 },
  ];
  constructor(public dataManagementService: DataManagementService, private _router: Router) {
    this.owner = owner;
   }

  ngOnInit() {
    if (this.dataManagementService.selectedZone == null) {
      this._router.navigate(['/pages/power/mainpanel-power']);
    }
  }


  selectInstallation(installation) {
    this.dataManagementService.selectedInstallation = installation;
    this._router.navigate(['/pages/power/installation-power']);
  }

  selectZone(zone) {
    this.dataManagementService.selectedZone = zone;
    this._router.navigate(['/pages/power/mainpanel-power']);
  }

}
