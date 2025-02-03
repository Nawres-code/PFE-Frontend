import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DetailsService } from './details.service';
import { EnergyService } from './energy.service';
import { GraphEntry, Unit, GraphData, UNIT_Array } from '../data/comaparator';
import { Point, Sensor, Group, Inputs, Sonde, Installation, IOImpulse } from '../data/data';
import { owner } from '../../global.config';
import { DataManagementService } from './data-management.service';
import { ArchivemetosService } from './archivemetos.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  loadSeries(graphtype: string, startDate: Date, endDate: Date, vect_1: any[], vect_1Ids: number[], period: String,
     wtype?: string,  vect_2?: any[], vect_2Ids?: number[], vars?: string[], yAxis?: Unit, installationName?: string):Observable<any[]> {
    switch(graphtype) {
      case 'ENERGY':
         return  new Observable((observer) => {
          this.energyService.getAllRepEnergy(
            {   startDate: startDate,
                endDate: endDate,
                groupIds: vect_1Ids,
            }, period,wtype
        ).subscribe({
          next:res => {
            let groupName = "";
            
            let series = [];
            let j = 0;
            for (let groupobj in res) {
              let instName ="";
                let groupdata = {};
                for (let i = 0; i < vect_1.length; i++) {
                    if (vect_1[i].id == +groupobj){
                      groupName = vect_1[i].name;
                      instName = installationName == ''?
                      this.getInstallationNameByGroup(+groupobj)
                      : installationName;
                      break;
                    }
                }
                let timeseries = new Array();
                for (let i = 0; i < res[groupobj].length; i++) {
                    timeseries[i] = [Date.parse(res[groupobj][i]["time"]), Math.round((res[groupobj][i]["sumAct"]) * 100) / 100];
                }
                groupdata["name"] = `${instName}:${groupName} - ${wtype} (${period})`;
                groupdata["data"] = timeseries;
                if(yAxis != undefined) {
                  groupdata['type'] = 'column';
                  groupdata['yAxis'] = UNIT_Array.indexOf(yAxis);
                  groupdata['tooltip'] = {};
                  groupdata['tooltip']['valueSuffix'] = ' ' + yAxis;
                }
                series[j] = groupdata;
                j++;
            }
                observer.next(series);
          },
          error: err => observer.error(err),
          complete: () => observer.complete()
          });
         });
      case 'DETAILS':
        return  new Observable((observer) => {
          if (vars[0] == 'temperature' || vars[0] == 'humidity') {
            this.detailsService.getAllDetailsTemperature(
              {
                sondeIds: vect_1Ids,
                vars: vars,
                startDate: startDate,
                endDate: endDate,
                inputIds: vect_2Ids}, period)
              .subscribe({
                next: res => {
                var series = [];
                var inSeries = [];
                let j = 0; // cmpt de serie
                let i = 0; // cmpt de input
                let sonde: Sonde;
                Object.keys(res).forEach(idSonde => {
                  if (+idSonde == -1) {
                    for (let inpt of vect_2) {
                      i = vect_2.indexOf(inpt);
                      inSeries[i] = {}; 
                      if (i > -1 ) {
                        inSeries[i]["area"] = {}
                        inSeries[i]["area"]["tooltip"] = {};
                        inSeries[i]['type'] = 'area';
                        inSeries[i]['connectNulls'] = true;
                        inSeries[i]['boostThreshold'] =  0;
                        // if(this.dataManagementService.tenantData.zones.length == 1 && this.dataManagementService.tenantData.zones[0].installations.length == 1 )
                        // {
                        //   inSeries[i]["name"] = `${inpt.category? inpt.category.name+' - ': ''}${inpt.name=='door'?'porte':inpt.name}`; 
                        // }else {
                          inSeries[i]["name"] = `${installationName? installationName +',': ''} ${inpt.category? inpt.category.name+' - ': ''}${inpt.name=='door'?'porte':inpt.name}`;
                        //}    
                        inSeries[i]["yAxis"] =  UNIT_Array.indexOf(Unit.ONOFF);
                        inSeries[i]["zindex"]=0;
                          if(inpt.color)
                          inSeries[i]["color"] = inpt.color; // "rgba(254, 206, 181,1)";

                        inSeries[i]["area"]["tooltip"]["pointFormat"] = '{point.x}:000'
                        inSeries[i]["data"] = new Array();
                        let ki = 0;
                        let status = 0; let lastTime = null;
                        Object.keys(res[idSonde]["valeurs"]).sort().forEach(time => {
                          inSeries[i]["data"][ki] = [];

                          if(lastTime != null) {
                          if(status != +res[idSonde]["valeurs"][time][inpt.id]) {
                            inSeries[i]["data"][ki][0] = lastTime + 1000 * 5;
                            if(inpt.inversed) {
                              inSeries[i]["data"][ki][1] = 1 - res[idSonde]["valeurs"][time][inpt.id];
                            } else {
                              inSeries[i]["data"][ki][1] = +res[idSonde]["valeurs"][time][inpt.id];
                            }
                            ki++;
                            inSeries[i]["data"][ki] = [];
                          }
                        }
                          inSeries[i]["data"][ki][0] = Date.parse(time);
                          if(inpt.inversed) {
                            inSeries[i]["data"][ki][1] = 1 - res[idSonde]["valeurs"][time][inpt.id];
                          } else {
                            inSeries[i]["data"][ki][1] = +res[idSonde]["valeurs"][time][inpt.id];
                          }
                          status = res[idSonde]["valeurs"][time][inpt.id];
                          lastTime = Date.parse(time);
                          // if (res[idSonde]["valeurs"][time][inpt.id] != null) {
                          //   if (status != +res[idSonde]["valeurs"][time][inpt.id]) {
                          //     inSeries[i]["data"][ki] = [];
                          //     inSeries[i]["data"][ki][0] = Date.parse(time);
                          //     inSeries[i]["data"][ki][1] = status;
                          //     status = inpt.inversed? 1 - res[idSonde]["valeurs"][time][inpt.id] : +res[idSonde]["valeurs"][time][inpt.id];
                          //     ki++;
                          //   } else {
                          //     inSeries[i]["data"][ki] = [];
                          //     inSeries[i]["data"][ki][0] = Date.parse(time);
                          //   if(inpt.inversed) {
                          //       inSeries[i]["data"][ki][1] = 1 - res[idSonde]["valeurs"][time][inpt.id];
                          //   } else {
                          //     inSeries[i]["data"][ki][1] = +res[idSonde]["valeurs"][time][inpt.id];
                          //   }
                          //     ki++;
                          //   }
                          // }
                          ki++;
                        });
                      }
                    }
                  }
                  // sonde case
                  else {
                    sonde = this.getSonde(+idSonde, vect_1);
                    if (sonde && sonde.configuration.indexOf('temperature') > -1 && vars.indexOf('temperature') > -1) {
                      // temperature
                      series[j] = {};
                      series[j]['type'] = 'line';
                      series[j]["name"] = sonde ? `${installationName}, ${sonde.name}-temperature (${period})` : '';
                      series[j]["yAxis"] = UNIT_Array.indexOf(Unit.Celsius);
                      series[j]["data"] = new Array();
                      series[j]["tooltip"] = {};
                      series[j]['tooltip']['valueSuffix'] = ' °C';
                      series[j]['color'] = 'red';
                      series[j] ["zIndex"] = j+1000;
                      let k = 0;
                      Object.keys(res[idSonde]["valeurs"]).sort().forEach(time => {
                        if (res[idSonde]["valeurs"][time]["temperature"] != null && res[idSonde]["valeurs"][time]["temperature"] < 80 * 16 && +res[idSonde]["valeurs"][time]["temperature"] > -40 * 16) {
                          series[j]["data"][k] = [];
                          series[j]["data"][k][0] = Date.parse(time);
                          series[j]["data"][k][1] = +parseFloat((+res[idSonde]["valeurs"][time]["temperature"] / 16)+'').toFixed(2);
                          k++;
                        }
                      });
                      j++;
                    }
                    if (sonde && sonde.configuration.indexOf('humidity') > -1 && vars.indexOf('humidity') > -1) {
                      // humidity
                      series[j] = {};
                      series[j]['type'] = 'line';
                      series[j]["name"] = sonde ? `${installationName}, ${sonde.name}-humidity (${period})` : '';
                      series[j]["data"] = new Array();
                      series[j]["yAxis"] = UNIT_Array.indexOf(Unit.Percentage);
                      series[j]["tooltip"] = {};
                      series[j]['tooltip']['valueSuffix'] = ' %';
                      series[j]['color'] = 'blue';
                      let kh = 0;
                      Object.keys(res[idSonde]["valeurs"]).sort().forEach(time => {
                        if (res[idSonde]["valeurs"][time]["humidity"] != null) {
                          series[j]["data"][kh] = [];
                          series[j]["data"][kh][0] = Date.parse(time);
                          series[j]["data"][kh][1] = +parseFloat((+res[idSonde]["valeurs"][time]["humidity"] / 2)+'').toFixed(2);
                          kh++;
                        }
                      });
                      j++;
                    }
                    if (sonde && sonde.configuration.indexOf('battery') > -1  && vars.indexOf('battery_percentage') > -1) {
                      // battery
                      series[j] = {};
                      series[j]['type'] = 'line';
                      series[j]["name"] = sonde ? `${installationName}, ${sonde.name}-battery (${period})` : '';
                      series[j]["yAxis"] = UNIT_Array.indexOf(this.getUnit('battery_percentage'));
                      series[j]["tooltip"] = {};
                      series[j]['tooltip']['valueSuffix'] = ' %';
                      series[j]["data"] = new Array();
                      series[j]['color'] = 'green';
                      let kb = 0;
                      Object.keys(res[idSonde]["valeurs"]).sort().forEach(time => {
                        if (res[idSonde]["valeurs"][time]["battery_percentage"] != null) {
                          series[j]["data"][kb] = [];
                          series[j]["data"][kb][0] = Date.parse(time);
                          series[j]["data"][kb][1] = +res[idSonde]["valeurs"][time]["battery_percentage"];
                          kb++;
                        }
                      });
                      j++;
                    }
                  }
                });
                series = [...inSeries, ...series, ];
                observer.next(series);},
                error: err => observer.error(err),
                complete: () => observer.complete()
                });
          } else if (vars[0] == 'in1'){
            this.detailsService.getAllDetailsGaz({
              gazIds: vect_1Ids,
              vars: vars,
              startDate: startDate,
              endDate: endDate
            }).subscribe({
              
              next: res => {
              var series = [];
              let j = 0;
              Object.keys(res).forEach(idGaz => {
                series[j] = {};
                series[j]["name"] = this.getGazName(+idGaz, vect_1) +` (${period})`;
                series[j]['yAxis'] = UNIT_Array.indexOf(yAxis);
                series[j]['tooltip'] = {};
                series[j]['tooltip']['valueSuffix'] = ' ' + yAxis;
                series[j]["data"] = new Array();
                let k = 0;
                Object.keys(res[idGaz]["valeurs"]).sort().forEach(time => {
                  series[j]["data"][k] = [];
                  series[j]["data"][k][0] = Date.parse(time);
                  series[j]["data"][k][1] = +res[idGaz]["valeurs"][time][vars[0]];
                  k++;
                });
                j++;
              });
              observer.next(series);},
              error: err => observer.error(err),
              complete: () => observer.complete()
              });
          } else if (vars[0] == 'point') {
            this.detailsService.getAllDetailsPoint(
              {
                pointIds: vect_1Ids,
                deviceIds: vect_2Ids,
                vars: ["point_value", "setpoint_value"],
                startDate: startDate,
                endDate: endDate
              }).subscribe(
                { next:res => {
                var series = [];
                let j = 0;
                Object.keys(res).forEach(uuid => {
                  series[j] = {};
                  series[j]["name"]= `${installationName}: ${vect_1.filter(value => value.id = +uuid % 1000).find(value => (value.deviceId == Math.round(+uuid / 1000))).label} - Point Value (${period})`;
                  series[j]['yAxis'] = UNIT_Array.indexOf(yAxis);
                  series[j]['tooltip'] = {};
                  series[j]['tooltip']['valueSuffix'] = ' ' + yAxis;
                  series[j]["data"] = new Array();
                  if (this.getPoint(vect_1, +uuid % 1000, Math.round(+uuid / 1000)).setpointId) {
                    series[j + 1] = {};
                    series[j + 1]["name"] =  `${installationName}: ${vect_1.filter(value => value.id = +uuid % 1000).find(value => (value.deviceId == Math.round(+uuid / 1000))).label} - Set Point (${period})`;
                    series[j + 1]['yAxis'] = UNIT_Array.indexOf(yAxis);
                    series[j + 1]['tooltip'] = {};
                    series[j + 1]['tooltip']['valueSuffix'] = ' ' + yAxis;
                    series[j + 1]["data"] = new Array();
                  }
                  let k = 0;
                  Object.keys(res[uuid]["valeurs"]).sort().forEach(time => {
                    series[j]["data"][k] = [];
                    series[j]["data"][k][0] = Date.parse(time);
                    series[j]["data"][k][1] = +res[uuid]["valeurs"][time]['point_value'];
                    if (this.getPoint(vect_1, +uuid % 1000, Math.round(+uuid / 1000)).setpointId) {
                      series[j + 1]["data"][k] = [];
                      series[j + 1]["data"][k][0] = Date.parse(time);
                      series[j + 1]["data"][k][1] = +res[uuid]["valeurs"][time]['setpoint_value'];
                    }
                    k++;
                  });
                  if (this.getPoint(vect_1, +uuid % 1000, Math.round(+uuid / 1000)).setpointId)
                    j += 2;
                  else
                    j++
  
                });
                observer.next(series);},
                error: err => observer.error(err),
                complete: () => observer.complete()
                });
  
          } else if (vars[0].startsWith('grouped_')) {
            let varToSend: string[] = [];
              for (let i = 0; i < vars.length; i++) {
                varToSend[i] = vars[i].substring(8);
              }
            this.detailsService.getAllDetailsGroups(
              {
                phaseIds: vect_1Ids,
                vars: varToSend,
                startDate: startDate,
                endDate: endDate
              }, period).subscribe({
                next:res => {
                var series = [];
                let j = 0;
                Object.keys(res).forEach(idGroup => {
                  series[j] = {};
                  let gp: Group = vect_1.find(g => g.id == idGroup);
                  series[j]["name"] = `${installationName}: ${gp ? gp.name : ''} - ${this.getGraphName(vars[0])} (${period})`;//this.getGroupName(+idGroup, vect_1);
                  series[j]['yAxis'] = UNIT_Array.indexOf(yAxis);
                  series[j]['tooltip'] = {};
                  series[j]['tooltip']['valueSuffix'] = ' ' + yAxis;
                  series[j]["data"] = new Array();
                  let k = 0;
                  Object.keys(res[idGroup]["valeurs"]).sort().forEach(time => {
                    series[j]["data"][k] = [];
                    series[j]["data"][k][0] = Date.parse(time);
                    if (vars[0].indexOf("power_max") != -1) {
                      if (+res[idGroup]["valeurs"][time][vars[0].substring(8)] == 0)//we will add current_max and voltage inst in back
                        res[idGroup]["valeurs"][time][vars[0].substring(8)] = +res[idGroup]["valeurs"][time]["current_max"] * +res[idGroup]["valeurs"][time]["voltage_inst"] / 1000;
                    }
                    if (vars[0].indexOf("power_min") != -1) {
                      if (+res[idGroup]["valeurs"][time][vars[0].substring(8)] == 0)//we will add current_max and voltage inst in back
                        res[idGroup]["valeurs"][time][vars[0].substring(8)] = +res[idGroup]["valeurs"][time]["current_min"] * +res[idGroup]["valeurs"][time]["voltage_inst"] / 1000;
                    }
                    // if (vars[0].indexOf("power_inst") != -1) {
                    //   if (+res[idGroup]["valeurs"][time][vars[0].substring(8)] == 0)//we will add current_max and voltage inst in back
                    //     res[idGroup]["valeurs"][time][vars[0].substring(8)] = +res[idGroup]["valeurs"][time]["current_inst"] * +res[idGroup]["valeurs"][time]["voltage_inst"] / 1000;
                    // }
                    if (vars[0].indexOf("power_moy") != -1) {
                      if (+res[idGroup]["valeurs"][time][vars[0].substring(8)] == 0)//we will add current_max and voltage inst in back
                        res[idGroup]["valeurs"][time][vars[0].substring(8)] = +res[idGroup]["valeurs"][time]["energy_act"] * 60;
                    }
                    series[j]["data"][k][1] = Math.round((Math.abs(+res[idGroup]["valeurs"][time][vars[0].substring(8)]) * 100)) / 100;
                    k++;
                  });
                  j++;
                });
                observer.next(series);},
                error: err => observer.error(err),
                complete: () => observer.complete()
                });
          } else if (vars[0].startsWith('IO_')) {
            this.detailsService.getAllDetailsIO (  
              {
                ids: vect_1Ids,
                startDate: startDate,
                endDate: endDate
              }, period).subscribe({
                next:res => {
                var series = [];
                let j = 0;
                Object.keys(res).forEach(idGroup => {
                  series[j] = {};
                  series[j+1] = {};
                  let gp: IOImpulse = vect_1.find(g => g.id == idGroup);
                  series[j]["name"] = `${installationName}: ${gp ? gp.name : ''} - ${this.getGraphName(vars[0])} (${period})`;//this.getGroupName(+idGroup, vect_1);
                  series[j+1]["name"] = `${installationName}: ${gp ? gp.name : ''} - compteur global (${period})`;//this.getGroupName(+idGroup, vect_1);

                  series[j]['yAxis'] = UNIT_Array.indexOf(Unit.M3);
                  series[j+1]['yAxis'] = UNIT_Array.indexOf(Unit.None);

                  series[j]['tooltip'] = {};
                  series[j+1]['tooltip'] = {};

                  series[j]['type'] = 'column';
                  series[j]['tooltip']['valueSuffix'] = ' ' + Unit.M3;
                  series[j+1]['tooltip']['valueSuffix'] = ' ' + Unit.M3;

                  series[j]["data"] = new Array();
                  series[j+1]["data"] = new Array();

                  let k = 0;
                  Object.keys(res[idGroup]["valeurs"]).sort().forEach(time => {
                    series[j]["data"][k] = [];
                    series[j]["data"][k][0] = Date.parse(time);
                    series[j]["data"][k][1] =  Math.round((+res[idGroup]["valeurs"][time]["value"]) * 100) / 100; // * impulse

                    series[j+1]["data"][k] = [];
                    series[j+1]["data"][k][0] = Date.parse(time);
                    series[j+1]["data"][k][1] = Math.round((+res[idGroup]["valeurs"][time]["global_count"]) * 100) / 100; // * impulse

                    k++;
                  });
                  j = j+2;
                });
                observer.next(series);},
                error: err => observer.error(err),
                complete: () => observer.complete()
                });
          } else {
            this.detailsService.getAllDetailsPhases(
              {
                phaseIds: vect_1Ids,
                vars: vars,
                startDate: startDate,
                endDate: endDate
              }, period).subscribe({
                next: res => {
                var series = [];
                let j = 0;
                let gName:string  ='';
                Object.keys(res).forEach(idPhase => {
                  series[j] = {};
                  try {
                    gName = this.dataManagementService.selectedInstallation.groupses.
                    find(g => g.phases.find(p => p.id == +idPhase)).name;
                  } catch (error) {}
                  series[j]["name"] = `${installationName}-${gName}:${vect_1.map(value => value.phases).flat().find(x => x.id == +idPhase).name} -  ${this.getGraphName(vars[0])} (${period})`;
                  // this.getPhaseName(+idPhase, vect_1);
                  series[j]['yAxis'] = UNIT_Array.indexOf(yAxis);
                  series[j]['tooltip'] = {};
                  series[j]['tooltip']['valueSuffix'] = ' ' + yAxis;
                  series[j]["data"] = new Array();
                  let k = 0;
                  Object.keys(res[idPhase]["valeurs"]).sort().forEach(time => {
                    series[j]["data"][k] = [];
                    series[j]["data"][k][0] = Date.parse(time);
                    if (vars[0].indexOf("power_max") != -1) {
                      if (+res[idPhase]["valeurs"][time][vars[0]] == 0)//we will add current_max and voltage inst in back
                        res[idPhase]["valeurs"][time][vars[0]] = +res[idPhase]["valeurs"][time]["current_max"] * +res[idPhase]["valeurs"][time]["voltage_inst"] / 1000;
                    }
                    if (vars[0].indexOf("power_min") != -1) {
                      if (+res[idPhase]["valeurs"][time][vars[0]] == 0)//we will add current_max and voltage inst in back
                        res[idPhase]["valeurs"][time][vars[0]] = +res[idPhase]["valeurs"][time]["current_min"] * +res[idPhase]["valeurs"][time]["voltage_inst"] / 1000;
                    }
                    // if (vars[0].indexOf("power_inst") != -1) {
                    //   if (!res[idPhase]["valeurs"][time][vars[0]] || +res[idPhase]["valeurs"][time][vars[0]] == 0)//we will add current_max and voltage inst in back
                    //     res[idPhase]["valeurs"][time][vars[0]] = +res[idPhase]["valeurs"][time]["current_inst"] * +res[idPhase]["valeurs"][time]["voltage_inst"] / 1000;
                    // }
                    if (vars[0].indexOf("power_moy") != -1) {
                      if (+res[idPhase]["valeurs"][time][vars[0]] == 0)//we will add current_max and voltage inst in back
                        res[idPhase]["valeurs"][time][vars[0]] = +res[idPhase]["valeurs"][time]["energy_act"] * 60;
                    }
                    series[j]["data"][k][1] = Math.round((Math.abs(+res[idPhase]["valeurs"][time][vars[0]]) * 100)) / 100;
                    k++;
                  });
                  j++;
                });
                observer.next(series);},
                error: err => observer.error(err),
                complete: () => observer.complete()
                });
          }
        });
      }
    return null;
  }

  graphSubject = new Subject<any>();
  graphEntries: GraphEntry[] = new Array();
  startDate: Date = new Date((new Date().getTime() - 2 * 86400000));
  endDate: Date = new Date(new Date().getTime() + 3600000);
  dateRangeChanged$: EventEmitter<Date[]> = new EventEmitter();
  owner = owner;
  listShow: boolean = false;
  showGraph: boolean = true;

  constructor(private dataManagementService: DataManagementService, private archivemetosService: ArchivemetosService, 
    private detailsService: DetailsService, private energyService: EnergyService) {
    //date
    this.dateRangeChanged$.emit([this.startDate, this.endDate]);
  }

  addGraphSerie(entry: GraphEntry, startDate: Date, endDate: Date, dateChanged: boolean = false) {
    let initGraph: boolean = false;
    initGraph = this.isDateChanged(startDate, endDate);
    if (entry != null) {
      if (entry.groupses.length != 0 || entry.sensorIds.length != 0) {
        this.graphEntries.push(entry);
      }
      if (initGraph ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.graphSubject.next(null);
        this.graphEntries.forEach((e) => { this.loadGraph(e) });
      } else {
        if ((this.owner != 'METOS' && entry.groupses.length > 0) || (this.owner == 'METOS' && entry.sensorIds.length > 0)) {
          this.loadGraph(entry);
        }
      }
      this.listShow = !(this.listShow) && this.graphEntries.length > 0 ? true : this.listShow;
    } else {
      if (initGraph || dateChanged) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.graphSubject.next(null);
        this.graphEntries.forEach((e) => { this.loadGraph(e) });
      }
    }
  }

  removeGraphSerie(indexEntry: number, indexGroup: number) {
    if (this.owner != 'METOS') {
      if (this.graphEntries[indexEntry].groupses.length == 1) {
        this.graphEntries.splice(indexEntry, 1);
      } else {
        this.graphEntries[indexEntry].groupses.splice(indexGroup, 1);
      }
    } else if (this.owner == 'METOS') {
      if (this.graphEntries[indexEntry].sensorIds.length == 1) {
        this.graphEntries.splice(indexEntry, 1);
      } else {
        this.graphEntries[indexEntry].sensorIds.splice(indexGroup, 1);
      }
    }
    // reload 
    this.graphSubject.next(null);
    if (this.graphEntries.length > 0) {
      this.graphEntries.forEach(e => this.loadGraph(e));
    }
  }

  loadGraph(entry: GraphEntry) {

    let graphs: GraphData = new GraphData();
    entry.status = true;
    let yAxis: Unit = Unit.None;
    if (this.owner != 'METOS') {
      let groupIds = [];
      let inputIds = [];
      let inputs: Inputs[] = [];
      let installation: Installation = new Installation();
      let vars = [];
      //  for (let entry of entries) {
      //seek for humidity & temperature
      if (entry.vars != null && entry.groupses != null && this.startDate != null && this.endDate != null) {
        let vect1, vect1Ids, vect2, vect2Ids, graphType:'ENERGY' |'DETAILS', wtype:string, tmpVars: string[];
        if (entry.vars == "temperature" || entry.vars == "humidity") {
          yAxis = Unit.Percentage;
          installation = this.dataManagementService.tenantData.zones.flatMap(z => z.installations).find(i => i.name == entry.installationName);
          if (entry.vars == "temperature") {
            yAxis = Unit.Celsius;
            inputs = installation.inputs;
            if (inputs.length > 0) {
              inputIds = inputs.map(inp => inp.id);
            }
          } else if (entry.vars == "humidity") {
            yAxis = Unit.Percentage;
          }
          if (entry.groupses[0].configuration.indexOf('battery') > -1 && entry.vars.indexOf('battery_percentage') < 0)
            vars = [entry.vars, 'battery_percentage'];
          else
            vars = [entry.vars];
          for (let sonde of entry.groupses) {
            groupIds.push(sonde.id);
          }
          graphType='DETAILS'; vect1= entry.groupses; vect1Ids = groupIds; vect2= inputs, vect2Ids= inputIds,
          wtype = null; tmpVars = vars;
        }
        else if (entry.vars == "point") {
          yAxis = Unit.None;
          let pointIds = new Array();
          let deviceIds = new Array();
          for (let point of entry.groupses) {
            pointIds.push(point.id);
            deviceIds.push(point.deviceId);
          }
          graphType='DETAILS'; vect1= entry.groupses; vect1Ids = pointIds; vect2= null, vect2Ids= deviceIds,
          wtype = null; tmpVars =  ["point_value", "setpoint_value"];
        }
        else if (entry.vars.startsWith('energy')) {
          yAxis = Unit.Kwh;
          for (let group of entry.groupses) {
            groupIds.push(group.id);
          };
          graphType='ENERGY'; vect1= entry.groupses; vect1Ids = groupIds; wtype = entry.vars;
        } else if (entry.vars.startsWith("grouped_")) {
          yAxis = this.getUnit(entry.vars);
          for (let group of entry.groupses) {
            //if (groupIds.indexOf(group.id) > -1) {
            for (let phase of group.phases) {
              groupIds.push(phase.id);
            };
            //}
          };
          graphType='DETAILS'; vect1= entry.groupses; vect1Ids = groupIds; vect2= null, vect2Ids= null,
          wtype = null; tmpVars =  [entry.vars];
        }
        else if (entry.vars.startsWith('IO_')) {
          graphType='DETAILS';
          vect1 = entry.groupses; vect1Ids = vect1.map(el=>el.id); vect2 = null; vect2Ids = null; tmpVars = [entry.vars];
  
        }
        //seek for Others ; to be developped 
        else
         // if (entry.vars != 'energy' && entry.vars != 'humidity' && entry.vars != 'temperature' && entry.vars != 'point' && !entry.vars.startsWith('grouped'))
          {
          yAxis = this.getUnit(entry.vars);
          for (let group of entry.groupses) {
            // if (groupIds.indexOf(group.id) > -1) {
            for (let phase of group.phases) {
              groupIds.push(phase.id);
            }
            //}
          };
          graphType='DETAILS'; vect1= entry.groupses; vect1Ids = groupIds; vect2= null, vect2Ids= null,
          wtype = null; tmpVars =  [entry.vars];
        }
        
        let sub = this.loadSeries(graphType,  this.startDate, this.endDate, vect1, vect1Ids, entry.period, wtype
        , vect2,vect2Ids,tmpVars,yAxis, entry.installationName)
        .pipe(take(1))
        .subscribe({
            next:(series) => {
              graphs.series = series ;
              this.graphSubject.next(graphs);
              entry.status = false;},
            error: (err) => { entry.status = false },
            complete:() => { entry.status = false;
              sub.unsubscribe();
             }});
      }
    } else if (this.owner == 'METOS') {
      let installation = this.dataManagementService.tenantData.zones[0].installations.find(i => i.name == entry.installationName);
      this.archivemetosService.getSensorsHistory(
        entry.stationId, entry.sensorIds, this.startDate, this.endDate)
        .subscribe(res => {
          if (res[installation.id] != undefined) {
            res = res[installation.id][entry.stationId];
            entry.sensorIds.forEach(sensorId => {
              let sensor: Sensor = this.dataManagementService.tenantData.sensors.find(s => s.id == sensorId);
              //sensor.graphType= 'column'; // test purpose
              if (res[sensorId]) {
                switch (sensor.graphType) {
                  case 'arearange':
                    graphs.series.push(...this.loadAreaRangeLineSensorSerie(entry.installationName
                      , this.getStationName(entry.stationId, installation.id)
                      , sensor, res[sensorId]));
                    break;
                  default:
                    graphs.series.push(this.loadSensorSerie(entry.installationName
                      , this.getStationName(entry.stationId, installation.id)
                      , sensor, res[sensorId]));
                    break;
                }
              }
            });
            this.graphSubject.next(graphs);
          }
          entry.status = false;
        },
          error => { entry.status = false },
          () => { entry.status = false; });
    }

  }

  getPoint(points: Point[], idPoint: number, idDevice: number) {
    for (let i = 0; i < points.length; i++) {
      if (points[i].id == +idPoint && points[i].deviceId == +idDevice)
        return points[i];
    }
  }

  reset() {
    this.graphSubject.next(null);
    this.graphEntries = new Array();
  }

  isDateChanged(startDate: Date, endDate: Date): boolean {
    try {
      return Math.abs(Math.floor(startDate.getTime() / 1000 / 60) - Math.floor(this.startDate.getTime() / 1000 / 60)) >= 1
        || Math.abs(Math.floor(endDate.getTime() / 1000 / 60) - Math.floor(this.endDate.getTime() / 1000 / 60)) >= 1;
    } catch {
      return false;
    }
  }

  private loadSensorSerie(installationName: string, stationName: string, sensor: Sensor, data: any[]): any {
    let serie = {};
    let timeseries = new Array();
    let aggr: string = sensor.aggr.split(',')[0];
    data.forEach(ele => {
      timeseries.push([Date.parse(ele['lastTime']), ele[aggr]]);
    });
    serie["name"] = `${stationName} - ${sensor.name}`;
    serie["data"] = timeseries;
    serie['type'] = sensor.graphType;
    if (sensor.graphType == 'area') {
      serie['marker'] = { enabled: false };
    }

    if (sensor.color != undefined && sensor.color != null && sensor.color != '') {
      serie['color'] = sensor.color;
    }
    serie['yAxis'] = this.getMetosUnits().indexOf(this.unitSensorPipe(sensor));
    serie['tooltip'] = {};
    serie['tooltip']['valueSuffix'] = ' ' + sensor.unit;
    return serie;
  }

  private loadAreaRangeLineSensorSerie(installationName: string, stationName: string, sensor: Sensor, data: any[]): any {
    let series = [{}, {}];
    let timeseries = new Array();
    let ranges = new Array();

    let aggr: string = sensor.aggr.split(',')[0];
    data.forEach(ele => {
      timeseries.push([Date.parse(ele['lastTime']), ele['avg']]);
      ranges.push([Date.parse(ele['lastTime']), ele['min'], ele['max']]);
    });
    series[0]["name"] = `${stationName} - ${sensor.name}`;
    series[0]["data"] = timeseries;
    series[0]['type'] = 'line';
    series[0]['zIndex'] = 1;
    series[0]['marker'] = { enabled: false };
    series[0]['color'] = '#FF0000';
    series[0]['yAxis'] = this.getMetosUnits().indexOf(this.unitSensorPipe(sensor));
    series[0]['tooltip'] = {};
    series[0]['tooltip']['valueSuffix'] = ' ' + sensor.unit;
    //
    series[1]["name"] = `${installationName}:${stationName} - ${sensor.name} ranges`;
    series[1]["data"] = ranges;
    series[1]['type'] = 'arearange';
    series[1]['lineWidth'] = 0;
    series[1]['linkedTo'] = ':previous';
    series[1]['marker'] = { enabled: false };
    series[1]['color'] = '#FF0000';
    series[1]['fillOpacity'] = 0.3;
    series[1]['zIndex'] = 0;
    series[1]['yAxis'] = this.getMetosUnits().indexOf(this.unitSensorPipe(sensor));
    series[1]['tooltip'] = {};
    series[1]['tooltip']['valueSuffix'] = ' ' + sensor.unit;
    return series;
  }

  getStationName(stationId: string, installationId?: number, installationName?: string): string {
    let installation;
    if (installationId) {
      installation = this.dataManagementService.tenantData.zones[0].installations.find(inst => inst.id == installationId);
    } else if (installationName) {
      installation = this.dataManagementService.tenantData.zones[0].installations.find(inst => inst.name == installationName);
    }
    if (installation) {
      let station = installation.stations.find(st => st.id == stationId);
      if (station)
        return station.name != '' ? station.name : station.id;
    }
    return '';
  }

  getSensorName(sensorId: string): string {
    let sensor = this.dataManagementService.tenantData.sensors.find(sens => sens.id == sensorId);
    if (sensor)
      return sensor.name;
    return null;
  }

  getMetosUnits(): string[] {
    let array = [];
    if (this.dataManagementService.tenantData.sensors.length > 0) {
      array.push(...this.dataManagementService.tenantData.sensors.map(s => this.unitSensorPipe(s)));
    }
    return array;
  }

  unitSensorPipe(s: Sensor): string {
    return (s.unit == '?' || s.unit == '-' || s.unit == null || s.unit == undefined) ? '' : s.unit;
  }

  getSondeByInstallation(idSonde: number, installation: Installation): Sonde {
    return installation.sondes.find(s => s.id == idSonde);
  }

  showGraphFunction() {
    if (this.showGraph == true) {
      this.showGraph = false
      localStorage.setItem('graph', "false")
    } else {
      this.showGraph = true
      localStorage.setItem('graph', "true")
    }
  }

  getSonde(idSonde: number, sondes?): Sonde {
    return sondes.find(s => s.id == idSonde);
  }

  private getUnit(vars: string): Unit {
    let yAxis: Unit = Unit.None;

    if (vars == "humidity" || vars == "battery_percentage") {
      yAxis = Unit.Percentage;
    }
    else if (vars == 'temperature') {
      yAxis = Unit.Celsius;
    }
    else if (vars == 'energy') {
      yAxis = Unit.Kwh;
    }
    else if (vars.indexOf('current') > -1 || vars.indexOf('Current') > -1) {
      yAxis = Unit.Ampere;
    }
    else if (vars.indexOf('power') > -1) {
      yAxis = Unit.Watt;
    }
    else if (vars.indexOf('voltage') > -1) {
      yAxis = Unit.Volt
    }
    return yAxis;
  }

  getGazName(idGaz: number, gazs) {
    for (let i = 0; i < gazs.length; i++) {
      if (gazs[i].id == +idGaz)
        return gazs[i].name;
    }
  }

  getPointName(idPoint: number, idDevice: number, points) {
    for (let i = 0; i < points.length; i++) {
      if (points[i].id == +idPoint && points[i].deviceId == +idDevice)
        return points[i].label;
    }
  }

  getGroupName(idGroup: number, groupses) {
    for (let i = 0; i < groupses.length; i++) {
      if (groupses[i].id == idGroup)
        return groupses[i].name;
    }
  }

  getPhaseName(idPhase: number, groupses) {
    for (let i = 0; i < groupses.length; i++) {
      for (let j = 0; j < groupses[i].phases.length; j++) {
        if (groupses[i].phases[j].id == idPhase)
          return groupses[i].phases[j].name;
      }
    }
  }
 
  getGraphName( vars: string): string {
    switch(vars){
      case 'grouped_power_inst': return 'Power inst';
      case 'grouped_power_moy': return 'Power moy';
      case 'grouped_power_max': return 'Power max';
      case 'grouped_power_min': return 'Power min';
      case 'power_inst': return 'Power inst phase';
      case 'power_moy': return 'Power moy phase';
      case 'power_max': return 'Power max phase';
      case 'power_min': return 'Power min phase';
      case 'grouped_current_inst': return 'Curent inst';
      case 'grouped_current_moy': return 'Curent moy';
      case 'grouped_current_max': return 'Curent max';
      case 'grouped_current_min': return 'Curent min';
      case 'Current_inst': return 'Current inst phase';
      case 'Current_moy': return 'Current moy phase';
      case 'Current_max': return 'Current max phase';
      case 'Current_min': return 'Current min phase';
      case 'voltage_inst': return 'Voltage inst';
      case 'voltage_moy': return 'Voltage moy';
      case 'voltage_max': return 'Voltage max';
      case 'voltage_min': return 'Voltage min';
      case 'phase_inst': return 'Cos Φ inst';
      case 'phase_moy': return 'Cos Φ moy';
      case 'phase_max': return 'Cos Φ max';
      case 'phase_min': return 'Cos Φ min';
      case 'IO_CALORIFIQUE':  return 'Calorifique';
      case 'IO_GAZ':  return 'Gaz';
      case 'IO_EAU':  return 'Eau';
    }
    return vars;
  }

  getInstallationNameByGroup(groupId: number){
   return  this.dataManagementService.tenantData.zones
                      .flatMap(z => z.installations)
                      .map(i=> {
                        if(i.groupses.find(g => g.id == groupId)
                        || ((i.provider) && (i.provider.groupses.map(gPhv => gPhv.id).indexOf(groupId)>-1)))
                         return i.name;
                       }).find(s => s!= undefined);
  }
}
