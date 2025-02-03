import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { Inputs, Installation } from '../../../@core/data/data';
import { InputRtDto } from '../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { LayoutService } from '../../../@core/utils';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-input-dash',
  templateUrl: './input-dash.component.html',
  styleUrls: ['./input-dash.component.scss']
})
export class InputDashComponent implements OnInit, OnDestroy {

  tz: number = 0;
  owner;
  vars: string[] = ['temperature'];
  faIcon = FA_ICONS;
  constructor(private dataManagementService: DataManagementService, private _router: Router,
    private sidebarService: NbSidebarService, private layoutService: LayoutService) {
    this.owner = owner;
    this.dataManagementService.getInptCacheStatus();
    try {
      if (this.dataManagementService.liveReloadingRT == undefined) {
        this.onGroupLoaded();
      }
    } catch (error) { }


      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }

  }

  ngOnInit(): void {
  }

  getDoorInput(installation: Installation) {
    try {
      return installation.inputs.filter(inp => inp.category.type == 'door')[0];
    } catch (e) {
      return null;
    }
  }

  getInputCategoriesName(installation: Installation): String[] {
    try {
      let x = new Set<String>();
      installation.inputs
        .filter(inp => inp.category.type != 'door')
        .map(inp => inp.category.name).forEach(c => x.add(c));
      return Array.from(x).sort();
    } catch (e) {
      return null;
    }
  }

  isAlarm(inputId: number, installation: Installation, type: string): boolean {
    try {
      const input: Inputs = installation.inputs.filter(inp => inp.id == inputId)[0];
      const rtInput: InputRtDto = this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
        .installationsRtDto[installation.id].inputsRtDto[inputId];
      return input.alarmStatus == type && rtInput.lastValue == input.alarmValue;//? res : 'basic'; //control
    } catch (e) { }
    return false;
  }

  isConnected(date: string): boolean {
    if (date == null) return false;
    try {
      var time = new Date(new Date().toUTCString()).getTime() - (new Date(date).getTime() + 1000 * 60 * this.tz);
      return Math.round(time / (60 * 1000)) <= 2
    } catch (e) {
      return false;
    }
  }

  getAccent(inputId: number, installation: Installation, type: string): string {
    if (this.isAlarm(inputId, installation, 'danger')) return 'danger';
    if (this.isAlarm(inputId, installation, 'warning')) return 'warning';
    try {
      if (this.isConnected(this.getRtInput(inputId, installation.id).lastTime)) return 'success';
    } catch (error) { }
    return '';
  }

  getRtInput(inputId: number, installationId: number) {
    try {
      return this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
        .installationsRtDto[installationId].inputsRtDto[inputId];

    } catch (e) {
      return null;
    }
  }

  getDateDiff(date: string): string {
    try {
      var time = new Date(new Date().toUTCString()).getTime() - (new Date(date).getTime() - 1000 * 60 * 60 * this.tz);
      if (time < 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 1000)) + "min";
      else if (time < 24 * 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 60 * 1000)) + "h";
      else if (time < 30 * 24 * 60 * 60 * 1000) {
        let res = Math.round(time / (24 * 60 * 60 * 1000));
        return res ? "+" + res + "j" : '--';
      } else {
        return '--';
      }
    } catch (e) {
      return '--';
    }
  }
  selectedItemDetails(installationId: number, itemIds: number[]) {
    let installation: Installation = this.dataManagementService.selectedZone.installations.find(i => i.id == installationId);
    this.dataManagementService.selectedInstallation = installation;
    if (owner == 'INPUT') {
      this.dataManagementService.selectedInstallation = installation;
      this.dataManagementService.inputs = installation.inputs.filter(item => itemIds.indexOf(item.id) >= 0);
      this._router.navigate(['/pages/historical/details'], { queryParams: { installation: installation.name, type: 'temperature', period: ' ', 'inputId': itemIds[0] } });
    } else {
      this.dataManagementService.groupses = [...installation.groupses];
      this._router.navigate(['/pages/historical/details'], { queryParams: { installation: installation.name, type: 'grouped_power_moy', period: 'Hours' }, fragment: 'container' });
    }
  }
  inputList(catName: string, installation: Installation): Inputs[] {
    try {
      return installation.inputs
        .filter(inp => inp.category.name == catName)
        .sort(function (a, b) {
          if (a.id < b.id) { return -1; }
          if (a.id > b.id) { return 1; }
          return 0;
        });;
    } catch (e) {
      return null;
    }
  }

  onGroupLoaded() {
    this.dataManagementService.startRt();
    this.dataManagementService.selectedZone =
      this.dataManagementService.selectedZone ?
        this.dataManagementService.selectedZone :
        this.dataManagementService.tenantData.zones[0];
  }

  private alive = true;
  myTimeout;
  ngOnDestroy(): void {
    clearTimeout(this.myTimeout);
    this.alive = false;
  }
}
