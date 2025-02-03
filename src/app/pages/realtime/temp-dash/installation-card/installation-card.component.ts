import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphEntry } from '../../../../@core/data/comaparator';
import { Installation, Sonde } from '../../../../@core/data/data';
import { InstallationRtDto } from '../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { GraphService } from '../../../../@core/service/graph.service';
import { owner } from '../../../../global.config';

@Component({
  selector: 'ngx-installation-card',
  templateUrl: './installation-card.component.html',
  styleUrls: ['./installation-card.component.scss']
})
export class InstallationCardComponent  implements OnInit {
  tz: number = 0;
  @Input()
  installation = new Installation(); 
  @Input()
  rtInstallation: any;

  owner 
  constructor(public dataManagementService: DataManagementService, public graphService:GraphService, private _router: Router) {
    this.owner = owner;
  }

  ngOnInit(): void {
    switch (owner) {
      case 'MEKATECHNOAUTH':
        this.tz = 1;
        break;
      case 'MEKATECH':
        this.tz = 1;
        break;
      case 'INPUT':
        this.tz =  0;
      break;
    }
  }

  getSondeTemperature(sonde: Sonde, installationId: number) {
    try {
      let temp: number;
      temp = this.rtInstallation.sondesRtDto[this.getRTSondeId(sonde.id)].lastTemperatue;
      if (temp < 80 * 16 && temp > -40 * 16) {
        return Math.round(temp / 16) + '°C';
      }
    } catch (e) {
      return '--';
    }
  }

  getSondeHumidity(sonde: Sonde, installationId: number) {
    try {
      let temp =this.rtInstallation.sondesRtDto[this.getRTSondeId(sonde.id)].lastHumidity;
      return Math.round(temp / 2) + '%';
    } catch (e) {
      return '--';
    }
  }


  getSondeBattery(sonde: Sonde, installationId: number) {
    try {
      let temp = this.rtInstallation.sondesRtDto[this.getRTSondeId(sonde.id)].lastBattery;
      return Math.round(temp) + '%';
    } catch (e) {
      return '--';
    }
  }

  getDateDiff(date: string): string {
    try {
      var time = new Date(new Date().toUTCString()).getTime() - (new Date(date).getTime() - 1000 * 60 * 60 * this.tz);
      if (time < 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 1000)) + "min";
      else if (time < 24 * 60 * 60 * 1000)
        return "+" + Math.round(time / (60 * 60 * 1000)) + "h";
      else if (time < 30*24*60*60*1000) {
       let res = Math.round(time / (24 * 60 * 60 * 1000));
        return res ? "+" + res + "j" : '--';
      } else if(time > (30 * 24 * 60 * 60 * 1000) * 6){
        return "--";
       } else if (time > 30*24*60*60*1000) {
        let res = Math.round(time / (30 * 24 * 60 * 60 * 1000));
         return res ? "+" + res + "Mois" : '--';
       } 
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

  getInstallationLastTime(installation){
    try {
      let times: Date[] = [];
      for (let entry of Object.entries(this.rtInstallation.sondesRtDto)) 
      { times.push(entry[1]['lastTime']); }
      return times.reduce(function (a, b) { return a > b ? a : b; })+'';
    } catch (error) {
      return '--';
    } 
  }


  onComparator(installation: Installation, periode: string) {
    let graphEntry: GraphEntry;
    let endDate: Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    let startDate: Date = new Date();
    startDate.setHours(0, 0, 0, 0);


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
      graphEntry = { installationName: installation.name, groupses: [...hymidities], period: periode, status: false, vars: 'humidity' };
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
    }
    this._router.navigate(['/pages/historical/comparator']);
  }

  onDetails(installation: Installation, periode: string) {
    this.dataManagementService.selectedInstallation = installation;
      this._router.navigate(['/pages/historical/details'], { queryParams: { instId: installation.id, type: 'temperature', period: 'Hours' } });
   
  }

  getRTSondeId(id){
    try {
      for(let k of Object.keys(
        this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone]
        .installationsRtDto[this.installation.id].sondesRtDto)) {
          if(new Number(k) == id ) return k; }
    } catch (error) { }
   
    return '';
  }
}
