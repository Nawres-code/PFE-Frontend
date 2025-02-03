import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Timer = NodeJS.Timer;
import { Zone } from '../../../../@core/data/data';
import { DataRtDto, GroupRtDto, ZoneRtDto } from '../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { owner } from '../../../../global.config';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-mainpanel-power',
  templateUrl: './mainpanel-power.component.html',
  styleUrls: ['./mainpanel-power.component.scss']
})
export class MainpanelPowerComponent implements OnInit {

  zone: Zone = new Zone;

  zoneRtDto: ZoneRtDto = new ZoneRtDto;

  sumAct: number;

  divPrefixZn: string = "ZN";

  groupsRTDto: GroupRtDto = new GroupRtDto;

  owner: string;

  liveReloadingRT: Timer;
  faIcon = FA_ICONS;
  constructor(public dataManagementService: DataManagementService, private _router: Router, private http: HttpClient) {
    this.owner = owner;
  }

  ngOnInit() {
    this.dataManagementService.getAllCategorieDetails(+localStorage.getItem("id")).subscribe(categories => {
      this.dataManagementService.tenantData.categories = categories;
    });

    this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id")).subscribe(
      zones => {
        this.dataManagementService.tenantData.zones = zones;
        if (this.dataManagementService.tenantData.zones.length == 1 && this.owner == "DEPOT") {
          this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
          this._router.navigate(['/pages/power/zone-power']);
        } else if (this.dataManagementService.tenantData.zones.length == 1 && this.owner == "FLEETDEPOT") {
          this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
          this._router.navigate(['/pages/power/zone-power']);
        } else if (this.dataManagementService.tenantData.zones.length == 1 && this.owner == "MEKATECH") {
          this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
          this._router.navigate(['/pages/power/zone-power']);
        } else if (this.dataManagementService.tenantData.zones.length == 1 && this.owner == "MEKATECHNOAUTH") {
          this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
          this._router.navigate(['/pages/power/zone-power']);
        }
        this.getRtTricity();
      });

    this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id")).subscribe(
      zones => {
        this.dataManagementService.tenantData.zones = zones;
        if (this.dataManagementService.tenantData.zones.length == 1 && this.owner == "METOS") {
          this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
          this._router.navigate(['/pages/power/zone-power']);
        }
        this.getRtTricity();
        // this.getRtGaz();
      });

    this.dataManagementService.getAllCategorieDetails(+localStorage.getItem("id")).subscribe(categories => {
      this.dataManagementService.tenantData.categories = categories;
    });

  }

  selectZone(zone) {
    this.dataManagementService.selectedZone = zone;
    this._router.navigate(['/pages/power/zone-power']);
  }

  getRtTricity() {
    this.dataManagementService.selectedDashbord = "TRICITY";
    this.dataManagementService.getRtData();
  }

  getRtCategory() {
    this.dataManagementService.getAllCategorieDetails(+localStorage.getItem("id")).subscribe(res => {
      this.dataManagementService.dataRtDto = new DataRtDto();
      this.dataManagementService.dataRtDto = res;
    })
  }

  /*getRtGaz(){
    this.dataManagementService.getAllEnergyGaz().subscribe(gazs =>{
      this.dataManagementService.tenantData.gazs = gazs;
    })
  }*/
} 
