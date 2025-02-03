import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Group, Installation } from '../../../../@core/data/data';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { owner } from '../../../../global.config';

@Component({
  selector: 'ngx-installation-power',
  templateUrl: './installation-power.component.html',
  styleUrls: ['./installation-power.component.scss']
})
export class InstallationPowerComponent  {

  group: Group = new Group;

  owner :string;

  selectedInstallation : Installation;

  installation : Installation = new Installation;
  constructor(public dataManagementService: DataManagementService, private _router: Router) { 
    this.owner = owner
  }

  ngOnInit() {

    if (this.dataManagementService.selectedInstallation == null) {
      this._router.navigate(['/pages/power/mainpanel-power']);
    }
  }

  selectedEnergy(group: Group) {
    this.dataManagementService.selectedGroup=group;
    this._router.navigate(['/pages/historical/energy']);
  }
  selectedDetails() {
    this._router.navigate(['/pages/historical/details']);
  }
  selectedCompartor() {
    this._router.navigate(['/pages/historical/comparateur']);
  }

  selectZone(zone) {
    this.dataManagementService.selectedZone = zone;
    this._router.navigate(['/pages/power/mainpanel-power']);
  }

  selectInstallation(installation) {
    this.dataManagementService.selectedInstallation = installation;
    this._router.navigate(['/pages/power/zone-power']);
  }
  getGroupCat(group: Group) {
    for (let catc of this.dataManagementService.tenantData.categories)
      if(group.categoryId==catc.id)
        return catc;
    return null;
  }
}
