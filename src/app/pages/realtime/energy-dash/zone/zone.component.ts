import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { GraphEntry, Unit } from '../../../../@core/data/comaparator';
import { Installation, Group, Category, Sonde, Inputs, Phase, Zone, IOImpulse } from '../../../../@core/data/data';
import { InstallationRtDto, ZoneRtDto, InputRtDto } from '../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { GraphService } from '../../../../@core/service/graph.service';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';
import { orderByField } from '../../../../@core/utils/global/order';
import { User } from '../../../../authenification/credentials';
import { owner } from '../../../../global.config';
import { PercentageComponent } from './percentage/percentage.component';
import { PopupDescComponent } from './popup-desc/popup-desc.component';
import { myConstants } from './zone.cont';

@Component({
  selector: 'ngx-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, OnDestroy {
  today: number = Date.now();
  installation: Installation = new Installation;
  zone: Zone = new Zone;
  owner: string;
  tz: number = 0;
  items = [
    { title: 'History', value: 1 },
    { title: 'Details', value: 2 },
    { title: 'Compare', value: 3 }
  ];
  datePipe = new DatePipe('en-Us');

  @ViewChildren(PercentageComponent)
  percentages: QueryList<PercentageComponent>;
  public currentUser: User = new User();
  search: any = { name: '' };
  faIcon = FA_ICONS;
  render = myConstants;
  gazDaily: number = 0; calorificDaily:number = 0; waterDaily:number = 0;
  constructor(public dataManagementService: DataManagementService, private _router: Router,
    private dialogService: NbDialogService, public graphService: GraphService) {
      try {
        let user = JSON.parse(localStorage.getItem('currentUser'));
      if(owner== 'ANME' && user.id == 49) {
      this.render.energySummaryColumnChart = true;
      this.render.energySummaryStackChart = false;
      this.render.energySummaryCards = false;
       }
      } catch (error) { }
      

      this.dataManagementService.eventIOTot.subscribe(
        resp => {
          try {
            this.gazDaily = resp.gaz;
          } catch (error) { this.gazDaily = 0; }
           try {
            this.calorificDaily = resp.calorific;
           } catch (error) { this.calorificDaily = 0;}
           try {
            this.waterDaily = resp.water;
           } catch (error) { this.waterDaily = 0; }
        });

    this.owner = owner;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    switch (this.owner) {
      case 'MEKATECHNOAUTH':
        this.tz = 1;
        break;
      case 'MEKATECH':
        this.tz = 1;
        break;
      case 'INPUT':
        this.tz =  0
      break;
    }
    
    this.dataManagementService.getInptCacheStatus();
  }

  ngOnInit() {
    // if (this.dataManagementService.selectedZone == null) {
    //   this._router.navigate(['/pages/realtime/mainpanel']);
    // }
    if (localStorage.getItem("graph") == "true") {
      this.graphService.showGraph = true
    } else {
      this.graphService.showGraph = false
    }
  }

 
  ngOnDestroy() {
  }

  selectInstallation(installation) {
    this.dataManagementService.selectedInstallation = installation;
    this._router.navigate(['/pages/realtime/energy/installation']);
  }

  selectedEnergy(selectedCategoryId: number, selectedCategoryName: string) {
    this.dataManagementService.groupses = undefined;
    this._router.navigate(['/pages/historical/energy'], 
    { queryParams: { zone: this.dataManagementService.selectedZone.name, cat:selectedCategoryName, catId:selectedCategoryId } });
  }

  selectedDetails(installationId: number) {
    let installation: Installation = this.dataManagementService.selectedZone.installations.find(i => i.id == installationId);
    this.dataManagementService.groupses = [...installation.groupses];
    this.dataManagementService.selectedInstallation = installation;
    this._router.navigate(['/pages/historical/details'], { queryParams: { installation: installation.name, type: 'grouped_power_moy', period: 'Hours' }, fragment: 'container' });
  }

  selectedItemDetails(installationId: number, itemIds: number[] ) {
    let installation: Installation = this.dataManagementService.selectedZone.installations.find(i => i.id == installationId);
    this.dataManagementService.selectedInstallation = installation;
    if(owner == 'INPUT'){
      this.dataManagementService.inputs = installation.inputs.filter(item=>itemIds.indexOf(item.id)>=0);
      this._router.navigate(['/pages/historical/details'], { queryParams: { installation: installation.name, type: 'temperature', period: ' ' }, fragment: 'container' });
    } else {
      this.dataManagementService.groupses = [...installation.groupses];
      this._router.navigate(['/pages/historical/details'], { queryParams: { installation: installation.name, type: 'grouped_power_moy', period: 'Hours' }, fragment: 'container' });
    }
  }

  selectedCompartor(selectedCategoryId: number) {
    this.dataManagementService.groupses = [];
    let groups: Group[];
    let graphEntry: GraphEntry;
    let endDate: Date = new Date();
    let startDate: Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    startDate.setTime(startDate.getTime() - 3 * 86400000);
    startDate.setHours(0, 0, 0, 0);
    this.graphService.graphEntries = new Array();
    for (let i of this.dataManagementService.selectedZone.installations) {
      groups = i.groupses.filter(g => g.categoryId == selectedCategoryId /*&& g.GroupsType === 'GENERAL'*/);
      graphEntry = { installationName: i.name, groupses: [...groups], period: 'Hours', status: false, vars: 'energy', sensorIds:[] };
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    }
    this._router.navigate(['/pages/historical/comparator']);
  }
  
  selectZone(zone) {
    try {
      if(this.dataManagementService.tenantData.zones.length > 1) {
        this.dataManagementService.selectedZone = zone;
        this._router.navigate(['/pages/realtime/energy/zone']);
      }
    } catch (error) { }
  }

  selectDashboard() {
    try {
        this._router.navigate(['/pages/realtime']);
    } catch (error) { }
  }

  getGroupsData(rtInstallation: InstallationRtDto, installation): {y:number, custom:{tooltipVal:string}}[] {
    let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
    let val= 0, sum= 0; 
    switch(this.owner){
      case 'KASSAB':
      case 'KASSAB2':
      case 'ANME':
        const catIds: number[] = this.orderByName(installation.groupses.filter(g => g.type != 'General' )).map(g => g.id);
         try {
          catIds.forEach( id =>{
              try {
                val = rtInstallation.groupsRtDto[id].eAct;
                sum += val;
                groupsEAct.push({y:val<0?0: val,
                  custom:{tooltipVal:Math.round(val)+''}});
              } catch (error) {
                groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
              } 
            });
         } catch (error) {
          
         }

         try {
          val = rtInstallation.groupsRtDto[installation.groupses.find(g => g.type == 'General' ).id].eAct - sum;
           groupsEAct.push({y:val<0?0: val,
            custom:{tooltipVal:Math.round(val)+''}});
        } catch (error) {
          groupsEAct.push({y:0, custom:{tooltipVal:'0'}});}
        
        
        break;
      default:
        try {
          const catIds: number[] = 
          this.owner == 'AZIZA'? this.dataManagementService.tenantData.categories.map(cat=>cat.id) :
          Object.keys(rtInstallation.eActPerCat).map(i=>+i).sort();
          this.dataManagementService.tenantData.categories
          .filter(cat=> cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
          .filter(cat=> catIds.indexOf(cat.id)>0)
          .map(cat => cat.id).forEach(
            idCat => {
              try {
                val = rtInstallation.eActPerCat[idCat].eAct;
                groupsEAct.push({y:val<0?0: val,
                  custom:{tooltipVal:Math.round(val)+''}});
              } catch (error) {
                groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
              }
            });
          } catch (error) {}
    
            try {
              val = rtInstallation.eActPerCat[this.dataManagementService.tenantData.categories.find(cat=> cat.name.toLowerCase() == 'autres').id].eAct;
              groupsEAct.push({y:val<0?0: val,
               custom:{tooltipVal:Math.round(val)+''}});
           } catch (error) {
            if(groupsEAct.length > 0)
             {groupsEAct.push({y:0, custom:{tooltipVal:'0'}});}
           }
        break;
    }
      
    return groupsEAct;
  }

  getGroupsLbl(rtInstallation: InstallationRtDto, installation: Installation) {
    let groupsLbl: string[] = [];
    switch(this.owner){
      case 'KASSAB':
        case 'KASSAB2':
      case 'ANME':
        groupsLbl = this.orderByName(installation.groupses.filter(g => g.type != 'General' )).map(g => g.name);
          groupsLbl.push('Autres');
        break;
        default:
      try {
        const catIds: number[] = 
        this.owner == 'AZIZA'? this.dataManagementService.tenantData.categories.map(cat=>cat.id) :
        Object.keys(rtInstallation.eActPerCat).map(i=>+i).sort();
        groupsLbl = this.dataManagementService.tenantData.categories
        .filter(cat=> cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
        .filter(cat=> catIds.indexOf(cat.id)>0)
        .map(cat=> cat.name);
        groupsLbl.push('Autres');
      } catch (error) {}
      break;
    }
    return groupsLbl;
  }

  getCatColors(insatllationRt: InstallationRtDto, installation: Installation): string[] {

    let groupsLbl: string[] = [];
    switch(this.owner){
      case 'ANME':
      case 'KASSAB':
        case 'KASSAB2':
         const catIds: number[] =
         this.orderByName(installation.groupses.filter(g => g.type != 'General' )).map(g => g.categoryId);
         try {
          catIds.forEach( id =>
            groupsLbl.push(this.dataManagementService.tenantData.categories.find(cat=>cat.id == id).color));
         } catch (error) {
          
         }
         try {
          groupsLbl.push(this.dataManagementService.tenantData.categories.find(cat=> cat.name.toLowerCase() == 'autres').color);
        } catch (error) { }
      break;
      default:
        try {
          const catIds: number[] =
          this.owner == 'AZIZA'? this.dataManagementService.tenantData.categories.map(cat=>cat.id) :
          Object.keys(insatllationRt.eActPerCat).map(i=>+i).sort();
          groupsLbl = this.dataManagementService.tenantData.categories
          .filter(cat=> cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
          .filter(cat=> catIds.indexOf(cat.id)>0)
          .map(cat=> cat.color);
        } catch (error) {}
        try {
          groupsLbl.push(this.dataManagementService.tenantData.categories.find(cat=> cat.name.toLowerCase() == 'autres').color);
        } catch (error) { }
    break;
  }
    return groupsLbl;
  }

  getInstallationData(rtZone: ZoneRtDto, zone: Zone): {y:number, custom:{tooltipVal:string}}[] {
      let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
      try {
      let val= 0;
      this.orderByName(this.getEnergyInstallation(this.dataManagementService.selectedZone.installations)).map(inst => inst.id).forEach(instId =>{
          try {
            val = rtZone.installationsRtDto[instId].eAct;
           groupsEAct.push(this.owner =='TRICITY' || this.owner =='ANME' || this.owner.includes('KASSAB')?{y:val<0?0: val,custom:{tooltipVal:val.toFixed(2)+''}}
             :{y:val<0?0: val,custom:{tooltipVal:Math.round(val)+''}});
         } catch (error) {
           groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
         }
        });
      } catch (error2) { }
    return groupsEAct;
  }

  getInstallationLbl(rtZone: ZoneRtDto, zone: Zone) {
    let groupsLbl: string[] = [];
    try {
    groupsLbl =  this.orderByName(this.getEnergyInstallation(this.dataManagementService.selectedZone.installations)).map(inst => inst.name);
    } catch (error) {}
    return groupsLbl;
  }

  getEactPerCat(category: Category): number {
    if (this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].eActPerCat[category.id])
      return +this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].eActPerCat[category.id]['eAct'];
  }
  openPopup(installation) {
    this.dataManagementService.selectedInstallation = installation;
    this.dialogService.open(PopupDescComponent);
  }

  getSondeData(sonde: Sonde, installationId: number) {
    if (!sonde)
      return null;
    if (!this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
      || !this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId]) { return null; }
    return this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId].sondesRtDto[sonde.id];
  }

  getSondeTemperature(sonde: Sonde, installationId: number) {
    try {
      let temp;
      temp = this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId].sondesRtDto[sonde.id].lastTemperatue;
      if (temp < 80 * 16 && temp > -40 * 16) {
        return Math.round(temp / 16) + '°C';
      }
    } catch (e) {
      return '--';
    }
  }

  getSondeHumidity(sonde: Sonde, installationId: number) {
    try {
      let temp = this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId].sondesRtDto[sonde.id].lastHumidity;
      return Math.round(temp / 2) + '%';
    } catch (e) {
      return '--';
    }
  }

  getSondeBattery(sonde: Sonde, installationId: number) {
    try {
      let temp = this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId].sondesRtDto[sonde.id].lastBattery;
      return Math.round(temp) + '%';
    } catch (e) {
      return '--';
    }
  }

  getDateDiffColor(date: string): string {
    if (!date)
      return "red";
    var time = new Date().getTime() - Date.parse(date);
    if (time < 60 * 60 * 1000)
      return "green";
    else if (time < 24 * 60 * 60 * 1000)
      return "orange";
    else
      return "red";
  }

  getDateDiff(date: string): string {
    try {
      var time = new Date(new Date().toUTCString()).getTime() - (new Date(date).getTime() - 1000 * 60 * 60 * this.tz);
      if (time < 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 1000)) + "min";
      else if (time < 24 * 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 60 * 1000)) + "h";
      else if (time < 30*24*60*60*1000){
        let res = Math.round(time / (24 * 60 * 60 * 1000));
        return res ? "+" + res + "j" : '--';
      }else{
        return '--';
      }
    } catch (e) {
      return '--';
    }
  }

  isConnected(date: string): boolean {
    if(date == null) return false;
    try {    
      var time =   new Date(new Date().toUTCString()).getTime() - (new Date(date).getTime() + 1000 * 60  * this.tz);
      return Math.round(time / (60 * 1000)) <= 2
    } catch (e) {
      return false;
    }
  }


  groupHasData(inst: Installation, group: Group) {
    if (!this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[inst.id])
      return false;
    if (!this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[inst.id].groupsRtDto)
      return false;
    if (this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[inst.id].groupsRtDto.length == 0)
      return false;
    if (!this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[inst.id].groupsRtDto[group.id])
      return false;
    return true;
  }
  
  enabled(installations: Installation[]) {
    try {
      return installations.filter(i => i.enabled);
    } catch (error) {
      return installations;
    }
  }
  

  onComparator(installation: Installation, periode: string) {
    let graphEntry: GraphEntry;
    let endDate: Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    let startDate: Date = new Date(new Date().getTime() - 108000000);

    let temperatures = installation.sondes.filter(s => s.configuration.indexOf('temperature') > -1);
    if (temperatures.length > 0) {
      graphEntry = {
        installationName: installation.name,
        groupses: [...temperatures], period: periode, status: false, vars: 'temperature'
      };
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    }

    let hymidities = installation.sondes.filter(s => s.configuration.indexOf('humidity') > -1);
    if (hymidities.length > 0) {
      graphEntry = { installationName: installation.name, groupses: [...hymidities], period: '1min', status: false, vars: 'humidity' };
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    }

    this._router.navigate(['/pages/historical/comparator']);
  }

  getInstallationLastTime(installation){
    try {
      let times: Date[] = [];
      for (let entry of Object.entries(this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
        .installationsRtDto[installation.id].sondesRtDto)) { times.push(entry[1]['lastTime']); }
      return times.reduce(function (a, b) { return a > b ? a : b; });
    } catch (error) {
      // console.debug(error);
      return '--';
    }
  }
  
  getDoorInput(installation: Installation){
    try{
      return  installation.inputs.filter(inp=> inp.category.type == 'door')[0];
    }catch (e) {
      return null;
    }
  }

  getInputCategoriesName(installation: Installation): String[] {
    try{
      let x = new Set<String>();
        installation.inputs
        .filter(inp=> inp.category.type != 'door')
        .map(inp=> inp.category.name).forEach(c=> x.add(c));
        return Array.from(x).sort();
    }catch (e) {
      return null;
    }
  }

  inputList(catName: string, installation: Installation): Inputs[]{
    try{
      return  installation.inputs.filter(inp=> inp.category.name == catName);
    }catch (e) {
      return null;
    }
  }

  getRtInput(inputId: number, installationId: number){
    try{
      return this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
                .installationsRtDto[installationId].inputsRtDto[inputId];
     
    }catch(e){
      return null;
    }
  }

  isAlarm(inputId: number, installation: Installation, type: string){
    try{
      const input: Inputs = installation.inputs.filter(inp=> inp.id == inputId)[0];
      const rtInput: InputRtDto = this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
      .installationsRtDto[installation.id].inputsRtDto[inputId];
      return input.alarmStatus == type && rtInput.lastValue == input.alarmValue;
    } catch(e) {}
    return false;
  }

  onInstallationEnergy(installation: Installation) {
    this.dataManagementService.groupses = [];
    let group: Group;
    this.dataManagementService.groupses
        .push(...installation.groupses.filter(g => g.GroupsType === 'GENERAL')
          .map(
            g => {
              group = JSON.parse(JSON.stringify(g));
              group.name = `${installation.name} - ${group.name}`;
              return group;
            }));
    this._router.navigate(['/pages/historical/energy'], { queryParams: { zone: this.dataManagementService.selectedZone.name } });
  }

  onComparatorEnergy(installation: Installation) {
    let graphEntry: GraphEntry;
    let endDate: Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    let startDate: Date = new Date(new Date().getTime() - 108000000);

    let groupses = installation.groupses.filter(g => g.type === 'General');
    if (groupses.length > 0) {
      graphEntry = { installationName: installation.name, groupses: [...groupses], period: 'Hours', status: false, vars: 'energy_act' };
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    }

    this._router.navigate(['/pages/historical/comparator']);
  }

  sortPhaseByVolatgeName(phases: Phase[]){
    return phases.sort(function(a, b){
      if(a['voltage'].name < b['voltage'].name) { return -1; }
      if(a['voltage'].name > b['voltage'].name) { return 1; }
      return 0;});
  }

  getEnergyUnit() {
    return Unit.Kwh;
  }

  getGazUnit() {
    return Unit.M3;
  }

  orderByName(array:any[]){
    return orderByField(array, 'name');
  }

  getAllIoTypes (ioList: IOImpulse[]): Set<string> {
    try {
      let typeArr: string[] = [];
      typeArr = ioList.map(item => item.type).sort();
      return new Set(typeArr);
    } catch (error) {
    }
  }

  getEnergyInstallation(installations: Installation[]){
    try {
      return installations.filter(i=> i.type =='standard' || i.type == 'circuitor');
    } catch (error) { }
  }

  getIoInstallation(installations: Installation[]){
    try {
      return installations.filter(i=> i.type =='io_impulse');
    } catch (error) { }
  } 
}