import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from '../../../../@core/data/comaparator';
import { TenantData } from '../../../../@core/data/data';
import { ZoneRtDto, DataRtDto } from '../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';
import { orderByField } from '../../../../@core/utils/global/order';
import { owner } from '../../../../global.config';

@Component({
  selector: 'ngx-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})
export class ZoneListComponent implements OnInit {
  owner = owner;
  faIcon = FA_ICONS;
  constructor(public dataManagementService: DataManagementService,  private _router: Router) { 
  }

  ngOnInit(): void { }

  getUnit(){
    return Unit.Kwh;
  }

  getCatColors(zoneRt: ZoneRtDto, zone: Zone): string[] {
    let groupsCalors: string[] = [];
    groupsCalors = this.dataManagementService.tenantData.categories
    .filter(cat=> cat.name != 'General' && cat.name != 'PV')
    .sort(function (a, b) {
      if (a.id < b.id) { return -1; }
      if (a.id > b.id) { return 1; }
      return 0;
    }).map(cat=> cat.color)
    return groupsCalors;
  }

  getCatData(zoneRt: ZoneRtDto, zone: Zone): {y:number, custom:{tooltipVal:string}}[] {
    let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
    let val= 0;
    this.dataManagementService.tenantData.categories
    .filter(cat=> cat.name != 'General' && cat.name != 'PV')
    .map(cat=> cat.id).sort().forEach(
      idCat => {
        try {
          val = zoneRt.eActPerCat[idCat].eAct;
          groupsEAct.push({y:val<0?0: val,
            custom:{tooltipVal:Math.round(val)+''}});
        } catch (error) {
          groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
        }
      });
    return groupsEAct;
  }

  getCatLbl(zoneRt: ZoneRtDto, zone: Zone) {
    let groupsLbl: string[] = [];
    groupsLbl = this.dataManagementService.tenantData.categories
    .filter(cat=> cat.name != 'General' && cat.name != 'PV')
    .sort(function (a, b) {
      if (a.id < b.id) { return -1; }
      if (a.id > b.id) { return 1; }
      return 0;
    }).map(cat=> cat.name)
    return groupsLbl;
  }


  getGroupsData(rtMain: DataRtDto, userData: TenantData): {y:number, custom:{tooltipVal:string}}[] {
    let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
    let val= 0;
    this.orderByName(this.dataManagementService.tenantData.zones)
    .map(zone=> zone.idZone)
    .forEach(
      idZone => {
        try {
          val = rtMain.zonesRtDto[idZone].eAct;
          groupsEAct.push({y:val<0?0: val,
            custom:{tooltipVal:Math.round(val)+''}});
        } catch (error) {
          groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
        }
      });
    return groupsEAct;
  }

  getGroupsLbl(rtMain: DataRtDto, userData: TenantData) {
    let groupsLbl: string[] = [];
    groupsLbl = this.orderByName(this.dataManagementService.tenantData.zones).map(zone=> zone.name);
    return groupsLbl;
  }

  selectZone(zone) {
    this.dataManagementService.selectedZone = zone;
    this._router.navigate(['/pages/realtime/energy/zone']);
  }

  getGeneralCat(){
    try {
      return [this.dataManagementService.tenantData.categories.find(cat=> cat.name == 'General')];
    } catch (error) { 
      return []
    }
  }

  orderByName(array) {
    return  orderByField(array, 'name');
  }

}
