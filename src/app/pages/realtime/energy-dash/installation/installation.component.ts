import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GraphEntry, Unit } from '../../../../@core/data/comaparator';
import { Group, Installation, Device, Phase, Point } from '../../../../@core/data/data';
import { SondeRtDto } from '../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { GraphService } from '../../../../@core/service/graph.service';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';
import { orderByField } from '../../../../@core/utils/global/order';
import { owner } from '../../../../global.config';

@Component({
  selector: 'installationpanel',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss']
})
export class InstallationComponent {
  today: number = Date.now();

  group: Group = new Group;

  owner : string;

  selectedInstallation : Installation;
 
  installation : Installation = new Installation;

  devices: Device[];
  faIcon = FA_ICONS;
  constructor(public dataManagementService: DataManagementService, private _router: Router, private graphService: GraphService) { 
    this.owner = owner;
  }
  summary: {title: string; value: number}[] =[{title: 'test1', value: 0}, {title: 'test2', value: 1}];

  ngOnInit() {
    if (this.dataManagementService.selectedInstallation == null) {
      this._router.navigate(['/pages/realtime']); 
    }
  }
  
  selectedEnergy(group: Group) {
    this.dataManagementService.groupses = [group];
   // this.dataManagementService.selectedInstallation = this.installation;
    this._router.navigate(['/pages/historical/energy'], { queryParams: { zone: this.dataManagementService.selectedZone.name } });
  }

  selectedDetails(group: Group) {
    this.dataManagementService.groupses = [group];
    // this.dataManagementService.selectedInstallation = this.installation;
    let instId = this.dataManagementService.selectedInstallation.id;
    let gid = group.id;
    if(owner == 'ANME' || owner.includes('KASSAB')) {
      this._router.navigate(['/pages/historical/details'], { queryParams: { type: 'grouped_power_inst', period: 'Hours' } });
    } else {
      this._router.navigate(['/pages/historical/details'], { queryParams: { instId: instId, id:gid, type: 'grouped_power_moy', period: 'Hours' } });
    }
   
  }

  selectedPointDetails(point: Point) {
    this.dataManagementService.points = [point];
    // this.dataManagementService.selectedInstallation = this.installation;
     this._router.navigate(['/pages/historical/details'], { queryParams: { type: 'point', period: 'Hours' } });
  }
  
  selectedCompartor(group: Group) {
    try {
      let graphEntry: GraphEntry = {installationName:this.dataManagementService.selectedInstallation.name, groupses:[group], period:'Hours', status:false, vars:'energy'}
    let endDate: Date = new Date();
    let startDate:Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    startDate.setTime(startDate.getTime() - 3 * 86400000);
    startDate.setHours(0, 0, 0, 0);
    this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    this._router.navigate(['/pages/historical/comparator']);
    } catch (error) {
      
    }
    
  }

  

  selectZone(zone) {
    try {
      if(this.dataManagementService.tenantData.zones.length > 1) {
        this._router.navigate(['/pages/realtime/energy/zone']);
      } else {
        this._router.navigate(['/pages/realtime']);
      }
    } catch (error) { }
  }

  selectDashboard() {
    this._router.navigate(['/pages/realtime']);
  }

  getDeviceName(idDevice: number) {
    for (let i = 0; i < this.dataManagementService.selectedInstallation.deviceFroids.length; i++) {
      if (this.dataManagementService.selectedInstallation.deviceFroids[i].id == +idDevice)
        return this.dataManagementService.selectedInstallation.deviceFroids[i].name;
    }
  }

  getGroupCat(group: Group) {
    for (let catc of this.dataManagementService.tenantData.categories)
      if(group.categoryId==catc.id)
        return catc;
    return null;
  }

  selectedCompartorByType(type: string) {
    let endDate: Date = new Date();
    let startDate:Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    startDate.setTime(startDate.getTime() - 3 * 86400000);
    startDate.setHours(0, 0, 0, 0);
    let graphEntry: GraphEntry ;
    switch (type) {
      case 'ALL_TMP':
        graphEntry = { installationName: this.dataManagementService.selectedInstallation.name, 
            groupses: this.dataManagementService.selectedInstallation.sondes, 
            period: 'Hours',
            status: false, 
            vars: 'temperature' }
          this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'ALL_POWER_MOY':
        graphEntry = { installationName: this.dataManagementService.selectedInstallation.name,
           groupses: this.dataManagementService.selectedInstallation.groupses, period: 'Hours', 
           status: false, vars: 'grouped_power_moy' }
        this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'TMP_POWER_MOY':
        // 
        graphEntry = { installationName: this.dataManagementService.selectedInstallation.name,
          groupses: this.dataManagementService.selectedInstallation.groupses, 
          period: 'Hours', 
          status: false, vars: 'grouped_power_moy' }
       this.graphService.addGraphSerie(graphEntry, startDate, endDate);
          //tmp
       graphEntry = { installationName: this.dataManagementService.selectedInstallation.name, 
        groupses: this.dataManagementService.selectedInstallation.sondes, 
        period: 'Hours', status: false, vars: 'temperature' }
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'AMBIENT_CLIM': 
        graphEntry = { installationName: this.dataManagementService.selectedInstallation.name,
           groupses: this.dataManagementService.selectedInstallation.groupses
                      .filter(g=> g.name == 'Climatisation')
           , period: 'Hours', status: false, vars: 'energy' }
        this.graphService.addGraphSerie(graphEntry, startDate, endDate);

        graphEntry = { installationName: this.dataManagementService.selectedInstallation.name,
          groupses: this.dataManagementService.selectedInstallation.sondes
                .filter(s=> s.type == 'Ambient')
          , period: 'Hours', status: false, vars: 'temperature' }
       this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
    }
    this._router.navigate(['/pages/historical/comparator']);
  }

  sortPhaseByVolatgeName(phases: Phase[]){
    return phases.sort(function(a, b){
      if(a.id < b.id) { return -1; }
      if(a.id > b.id) { return 1; }
      return 0;}).slice(0,3).sort(function(a, b){
      if(a['voltage'].name < b['voltage'].name) { return -1; }
      if(a['voltage'].name > b['voltage'].name) { return 1; }
      return 0;});
  }
  
  getUnit(){
    return Unit.Kwh;
  }
  alarmPointsFilter(points: Point[]) : Point[] {
    return orderByField(points.filter(pt => pt.type != 'alarm'),'label');
  }
  
  getRTSondeId(id){
    for(let k of Object.keys(
    this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
    .installationsRtDto[this.dataManagementService.selectedInstallation.id].sondesRtDto)) {
      if(new Number(k) == id ) return k; }
    return '';
  }

    getDateDiffColor(date: string): string {
      try {
      if (!date)
        return "red";
      var time = new Date().getTime() - Date.parse(date) - (1000*60*60);
      if (time < 60 * 60 * 1000)
        return "green";
      else if (time < 24 * 60 * 60 * 1000)
        return "orange";
      else
        return "red";
      } catch(error) { return '';}
    }

    getBatteryDiffColor(rtSonde: SondeRtDto ): string {
      try {
        if(this.getDateDiffColor(rtSonde.lastTime+'') == 'green') {
           rtSonde.lastBattery >= 50? 'green': rtSonde.lastBattery < 20? 'red':'';
        }
      } catch (error) { }
       return this.getDateDiffColor(rtSonde.lastTime+'');
    }

    getLastTimeSonde(sondeId: number): Date{
      try {
        return new Date( Date.parse(this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
          .installationsRtDto[this.dataManagementService.selectedInstallation.id]
          .sondesRtDto[this.getRTSondeId(sondeId)].lastTime) - (1000*60*60));
      } catch (error) {
        return null;
      }
    }

    getGroupses(groupses){
      switch (this.owner){
        case 'AZIZA':
        return groupses.sort(function(a, b){
          if(a.id < b.id) { return -1; }
          if(a.id > b.id) { return 1; }
          return 0;});
        default: 
          return this.orderByName(groupses);
      }
    }

    orderByName(array) {
      return orderByField(array, 'name');
    }

    getGeneralGroup(): Group {
      try {
        return this.dataManagementService.selectedInstallation.groupses.find(g => g.type == 'General');
      } catch (error) {
        return null;
      }
    }
}
