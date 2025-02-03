import { Component, OnDestroy } from '@angular/core';
import { Installation, Group, Point, Zone, Inputs, Sonde } from '../../../@core/data/data';
import { DataManagementService } from "../../../@core/service/data-management.service";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { owner } from "../../../global.config";
import { delay, takeWhile } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NbDateTimePickerComponent, NbSidebarService } from '@nebular/theme';
import { myConstants  } from './details.const';
import { orderByField } from '../../../@core/utils/global/order';
import { LayoutService } from '../../../@core/utils';
@Component({
  selector: 'ngx-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnDestroy {
  
  // seclect zone
  zones: Zone[] = Array();
  selectedZones: Zone = new Zone();

  // seclect installation
  installations: Installation[] = Array();
  selectedInstallations: Installation = new Installation();

  //select group
  groupses: Group[] = [];
  selectedGroups: any[] = [];
  groupIds: number[] = [];

  //select periode
  period = 'Hours';
  periods = [{label:'5 min', value:'5min'}, {label:'Heure', value:'Hours'},
   {label:'Jour',value:'Day'}, {label:'Mois', value:'Month'}];

  //date
  startDate: Date = new Date();
  endDate: Date = new Date();

  formControl2 = new FormControl(this.startDate);
  formControl1 = new FormControl(this.endDate);

  //vars
  vars: string[] = [];

  ///owner
  owner: string = owner;

  //inputs
  inputs: Inputs[] = [];

  refreshNow: Date;
  lastUpdate: Date;

  private alive: boolean = true;

  selectedMoments : Date = new Date();
  formExpanded: boolean = true;
  render = myConstants;
  params= undefined;
  selectedMeasures;
  constructor(private route: ActivatedRoute, public dataManagementService: DataManagementService, private _router: Router, private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
    
    // this.vars.push("Loading");
    this.owner = owner;
    this.endDate.setHours(23, 59, 59, 0);
    this.startDate.setTime(this.startDate.getTime() - 3 * 86400000);
    this.startDate.setHours(0, 0, 0, 0);

    this._router.events
      .pipe(takeWhile(()=>this.alive))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
         //  instId: instId, id:gid, type: 'grouped_power_moy', period: 'Hours'
           this.params = this._router.parseUrl(this._router.url).queryParams;
          try {
            this.dataManagementService.tenantData.zones[0].name;
            this.onGroupLoaded();
            this.init(); 
          } catch (error) { }
           this.dataManagementService.GroupsLoaded$
           .pipe(takeWhile(() => this.alive))
           .pipe(delay(50))
           .subscribe(tenantData => {
             this.onGroupLoaded();
             this.init(); 
            });

        }
      });

    // Fix NbDateTimePickerComponent for @nebular/theme 9.0.0
    NbDateTimePickerComponent.prototype.ngOnInit = function () {
      this.format = this.format || this.buildTimeFormat();
      this.init$.next();
    };
    switch(owner){
      case 'DEPOT':
      case 'FLEETDEPOT':
      case 'MEKATECH':
      case 'IOT':
        this.periods = [{label:'5 min', value:'5min'}, {label:'Heure', value:'Hours'}];  
        this.vars[0] = 'temperature';
      break;
      case 'INPUT':
        this.vars[0] = 'temperature';
      break;
    }
  }


  init() {
    try {
    if (this.params['type'] && this.params['period']) {
      let groups = [];
      if ((this.params['type'] == 'grouped_power_moy' || this.params['type'] == 'grouped_power_inst')) {
        try {
          groups = [...this.dataManagementService.groupses];
        } catch (error) {
          if(groups.length <1 ) { 
            loopz:
            for(let z of this.dataManagementService.tenantData.zones) {
              loopi:
              for(let i of z.installations){
                loopg:
                for(let g of i.groupses){
                  if( g.id == +this.params['id']) { 
                    this.dataManagementService.selectedZone = z;
                    this.dataManagementService.selectedInstallation = i;
                    groups = [g];
                    break loopz;
                  }
                }
              } 
            }
          }
        }
      } else if (this.params['type'] == 'point' && this.dataManagementService.points != undefined) {
        groups = [... this.dataManagementService.points];
      } 
      else if (this.params['type'] == 'temperature' && this.dataManagementService.inputs != undefined) {
        groups = this.dataManagementService.inputs;
        this.selectedMeasures = this.inputList(groups[0].category.name, this.dataManagementService.selectedInstallation)
                  .filter(inp=>inp.id == groups[0].id);
      }  else if (this.params['type'] == 'temperature') {
        groups = this.dataManagementService.selectedInstallation.sondes;
        this.inputs = this.dataManagementService.selectedInstallation.inputs;
      } 
      this.vars = [this.params['type']];
      this.period = this.params['period'];
   
      this.selectedZones = this.dataManagementService.selectedZone;
      this.selectedInstallations =  this.dataManagementService.selectedInstallation;
      this.installations = this.dataManagementService.selectedZone.installations;
      this.selectedGroups = groups;
      this.chooseGroup(this.selectedGroups);
      this.refreshZone();
      this.params = undefined;
    } } catch(e){}

    try {
      if(this.dataManagementService.tenantData.zones.length == 1 
        || this.dataManagementService.selectedZone == undefined){
        this.dataManagementService.selectedZone = this.dataManagementService.tenantData.zones[0];
        this.dataManagementService.selectedInstallation =  
        this.dataManagementService.selectedZone.installations.length == 1?  
        this.dataManagementService.selectedZone.installations[0] : this.dataManagementService.selectedInstallation;
        this.selectedInstallations = this.dataManagementService.selectedInstallation;
      }
    } catch(error){}

    this.selectedZones = this.dataManagementService.selectedZone;
    this.installations = this.dataManagementService.selectedZone.installations;
  }

  refreshZone(){
    this.formExpanded = true;
    this.lastUpdate = new Date();
  }
  chooseZone(zone) {
   this.dataManagementService.selectedZone = zone;
   this.selectedZones = zone;
   this.installations = this.selectedZones.installations;
   this.chooseInstallation(null);
  }

  chooseInstallation(installation) {
    this.dataManagementService.selectedInstallation = installation;
    this.selectedInstallations = installation;
    this.selectedGroups = new Array();
    this.groupIds = new Array();
    this.vars = [];
    switch (owner) {
      case 'DEPOT':
      case 'FLEETDEPOT':
      case 'MEKATECH':
      case 'IOT':
        this.inputs = this.selectedInstallations.inputs;
        break;
      default:
        break;
    }
  }

  chooseGroup(group) {
    if (this.selectedGroups != undefined){
      this.selectedGroups = group;
      if(owner =='INPUT') {
        this.period = '1min';
        let s: Sonde =new Sonde(); s.id = 1234; s.configuration="";
        this.selectedGroups = [s];
        this.inputs = [...group];
      }
    }
    this.groupIds = new Array();
    let i = 0;
    this.selectedGroups.forEach(group => {
      this.groupIds[i] = group.id;
      i++;
    });
  }

  drawChart() {
  }

  isSonde(val: String): Boolean {
    if (val == "temperature" || val == "humidity")
      return true;
    return false;
  }

  getMesureContainer(val: string): any[] {
    try {
      if (this.dataManagementService.selectedInstallation) {
      
          if (val == "temperature" || val == "humidity") {
            return this.orderArrayByName(this.selectedInstallations.sondes.filter(s=> s.configuration.indexOf(val)>-1));
          } else if (val == "in1") {
            return this.dataManagementService.selectedInstallation.gazs;
          } else if (val == "point") {
            return orderByField(this.dataManagementService.selectedInstallation.points,'label');
          } else if (val == "avg_value") {
            return this.orderArrayByName(this.dataManagementService.selectedInstallation.stations);
          } else if(val.startsWith('IO_')){
            return this.orderArrayByName(this.dataManagementService.selectedInstallation
              .ioList.filter(el => el.type == val.replace('IO_','')));
          } else
            return this.orderArrayByName(this.dataManagementService.selectedInstallation.groupses);
       }
    } catch (error) { }
    return null;
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

  getPointName(point: Point) {
    return this.dataManagementService.getDeviceFroidName(point.deviceId) + "-" + point.label;
  }

  onReset() {
    this.lastUpdate = null;
  }

  getInputCategoriesName(installation: Installation): String[] {
    try{
      let x = new Set<String>();
        installation.inputs.map(inp=> inp.category.name).forEach(
          c=> { x.add(c);});
        return Array.from(x).sort();
    } catch (e) {
      return null;
    }
  }

  inputList(catName: string, installation: Installation): Inputs[]{
    try{
      return  orderByField(installation.inputs.filter(inp=> inp.category.name == catName), 'id');
    }catch (e) {
      return null;
    }
  }

  filterForUser(installations:Installation[]):Installation[]{
    return installations.filter(i=>this.dataManagementService.userHasInstallation(i.id));
  }

  collapseForm(dataStatus: boolean){
    this.formExpanded = !dataStatus;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onGroupLoaded() {
    this.dataManagementService.selectedZone =
    this.dataManagementService.selectedZone?
      this.dataManagementService.selectedZone : this.dataManagementService.tenantData.zones[0];
    this.selectedZones = this.dataManagementService.selectedZone;
  }

  isAllValid(): boolean{
    try {
      return (this.selectedZones.name!=undefined) && (this.selectedInstallations.name!=undefined) &&  (this.vars[0]!=undefined) 
    && (this.period!=undefined) && (this.selectedGroups.length > 0);
    } catch (error) {
      return true;
    }
    
  }

  orderArrayByName(array){
    return orderByField(array,'name');
  }


  getAllIoTypes (installation): Set<string> {
    try {
      let typeArr: string[] = [];
      typeArr = installation.ioList.map(item => item.type).sort();
      return new Set(typeArr);
    } catch (error) {
    }
  }
}

