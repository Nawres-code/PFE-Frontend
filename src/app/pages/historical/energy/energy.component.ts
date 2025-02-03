import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NbDateTimePickerComponent, NbSidebarService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { Group, Installation, Point, Zone } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { LayoutService } from '../../../@core/utils';
import { orderByField } from '../../../@core/utils/global/order';
import { owner } from "../../../global.config";
import { myConstants } from './energy.const';

@Component({
  selector: 'ngx-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss']
})
export class EnergyComponent implements OnDestroy {
  // selection Instalation
  zones: Zone[] = Array();
  installations: Installation[] = Array();
  selectedInstallations: Installation = new Installation();
  selectInstallationsOptions: Installation[] = [];
  selectedZone: Zone= new Zone();
  //select group
  groups: Group[] = Array();
  selectedGroups: Group[] = new Array();
  groupIds: number[] = new Array();

  //select periode
  period = 'Hours';
  periods = ['5min', 'Hours', 'Day', 'Month'];

  //date
  startDate: Date = new Date();
  endDate: Date = new Date();

  refreshNow: Date;
  owner: string;
  lastUpdate: Date;
  wType: string = 'energy_act';
  formExpanded: boolean = true;
  formControl = new FormControl(this.startDate);
  formControl1 = new FormControl(this.endDate);

  render = myConstants;
  measurePlaceholder = 'Select Mesures';
  params= undefined;
  alive = true;
  constructor(public dataManagementService: DataManagementService, private _router: Router, 
    private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
    this.owner = owner;
    //date
    this.endDate.setHours(23, 59, 59, 0);
    this.startDate.setTime(this.startDate.getTime() - 3 * 86400000);
    this.startDate.setHours(0, 0, 0, 0);
    this.period = "Hours";
     
       // Fix NbDateTimePickerComponent for @nebular/theme 9.0.0
    NbDateTimePickerComponent.prototype.ngOnInit = function () {
      this.format = this.format || this.buildTimeFormat();
      this.init$.next();
    };

    
    
    this._router.events
    .pipe(takeWhile(()=>this.alive))
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.params = this._router.parseUrl(this._router.url).queryParams; 
      
        try {
          this.dataManagementService.tenantData.zones[0].name;
          this.onGroupLoaded();
          this.init(this.dataManagementService.tenantData.zones);
        } catch (error) { }
      
      this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(50))
      .subscribe(tenantData => {  this.onGroupLoaded();
        this.init(this.dataManagementService.tenantData.zones); });       
      }
    });
  }
  ngOnDestroy(): void {
    this.alive = false; 
  }

  init(zones) {
    let k = 0;
    for (let i = 0; i < zones.length; i++) {
      for (let j = 0; j < zones[i].installations.length; j++) {
        this.installations[k] = zones[i].installations[j];
        k++;
      }
    }

    try {
      this.zones = zones;
      this.dataManagementService.selectedZone = this.dataManagementService.selectedZone?this.dataManagementService.selectedZone: zones[0];
      this.selectedZone = this.selectedZone.installations[0]? this.selectedZone:this.dataManagementService.selectedZone;
      this.installations = this.installations[0]? this.installations: this.selectedZone.installations;
    } catch (error) { }

  try {
    if (this.params['zone']) {
      try {
        this.chooseZone
        (this.dataManagementService.tenantData.zones
          .find(z=> z.name.toLowerCase() == this.params['zone'].toLowerCase())); 
      } catch (error) { }
        
      
      if (this.dataManagementService.groupses != undefined && this.dataManagementService.groupses != null) {
        if (this.dataManagementService.selectedInstallation) {
          this.chooseInstallation(
            this.selectedZone.installations
            .find(i=> i.id == this.dataManagementService.selectedInstallation.id)
            );
        } 
            this.selectedGroups = this.dataManagementService.groupses;
            this.chooseGroup(this.selectedGroups);
        }
      else { 
        this.selectedGroups = this.selectedZone.installations.flatMap(i=>i.groupses)
        .filter(g => g.categoryId == +(this.params['catId']));
        this.chooseGroup(this.selectedGroups);
        this.measurePlaceholder = this.params['cat']; }
        this.refreshZone();
        this.params = undefined;
    }
  } catch (error) { }
   
  }

  refreshZone(){
    this.formExpanded = true;
    this.lastUpdate=new Date();
  }

  chooseZone(zone) {
    if(zone != undefined && zone != null ){
      this.dataManagementService.selectedZone = zone;
      this.selectedZone = zone;
      this.chooseInstallation(null);
    }
  }

  chooseInstallation(installation: Installation) {
    if(installation != undefined && installation != null ){
      if(installation) {
        this.dataManagementService.selectedInstallation = installation;
      }
    }
      this.selectedInstallations = installation;
      this.selectedGroups = new Array();
      this.groupIds = new Array();
  }

  chooseGroup(group) {
    if (this.selectedGroups != undefined)
      this.selectedGroups = group;
    this.groupIds = new Array();
    let i = 0;
    this.selectedGroups.forEach(group => {
      this.groupIds[i] = group.id;
      i++;
    });
  }

  getPointName(point: Point) {
    return this.dataManagementService.getDeviceFroidName(point.deviceId) + "-" + point.label;
  }

  onReset() {
    this.refreshNow = new Date();
  }

  getSubGeneral(groups: any[]) {
    let ret: Group[] = [];
    if (groups)
      for (let group of groups) {
        if (group.type != "General")
          ret.push(group);
      }
    return ret;
  }

  collapseForm(dataStatus: boolean){
    this.formExpanded = !dataStatus;
  }

  onGroupLoaded() {
    this.dataManagementService.selectedZone =
    this.dataManagementService.selectedZone?
      this.dataManagementService.selectedZone: 
      this.dataManagementService.tenantData.zones[0];
  }

  getEnergyInstallation(installations: Installation[]){
    try {
      return installations.filter(i=> i.type =='standard');
    } catch (error) { }
  }

  orderByName(array:any[]){
    return orderByField(array, 'name');
  }
}
