import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { Group, Sonde, Point, Device, Gaz, Station, Inputs } from '../../../../@core/data/data';
import { GraphService } from '../../../../@core/service/graph.service';
import { UNIT_Array, Unit } from '../../../../@core/data/comaparator';
import { owner } from "../../../../global.config";

import * as Highcharts from 'highcharts';
import { LayoutService } from '../../../../@core/utils';
import { take, takeWhile } from 'rxjs/operators';

declare var require: any;
const hc = require('highcharts');
const Boost = require('highcharts/modules/boost');
const exporting = require('highcharts/modules/exporting');
const More = require('highcharts/highcharts-more');
const exportData = require('highcharts/modules/export-data');
const brokenAxis = require('highcharts/modules/broken-axis');

Boost(hc);
exporting(hc);
exportData(hc);
More(hc);
brokenAxis(hc);

@Component({
  selector: 'app-details-graph',
  templateUrl: './details-graph.component.html',
  styleUrls: ['./details-graph.component.scss']
})
export class DetailsGraphComponent implements OnInit, OnDestroy {
  //select group
  @Input()
  groupIds: number[] = new Array();
  @Input()
  groupses: Group[] = new Array();
  //select sondes
  @Input()
  sondes: Sonde[] = new Array();
  sondeIds: number[] = new Array();
  //select point
  @Input()
  points: Point[] = new Array();

  @Input()
  deviceIds: number[] = new Array();
  @Input()
  devices: Device[] = new Array();

  @Input()
  gazIds: number[] = new Array();
  @Input()
  gazs: Gaz[] = new Array();

  @Input()
  stations: Station[] = new Array();

  pointIds: number[] = new Array();
  //date
  @Input()
  startDate: Date = new Date();
  @Input()
  endDate: Date = new Date();
  @Input()
  vars: string[] = new Array();
  @Input()
  period: string;

  @Input()
  inputs: Inputs[] = new Array();

  @Input()
  refreshNow: Date;

  _lastUpdate: Date
  @Input('lastUpdate')
  set lastUpdate(lastUpdate: Date) {
    this._lastUpdate = lastUpdate;
    if (this._lastUpdate)
      this.refresh();
  }

  @Output()
  onData: EventEmitter<boolean> = new EventEmitter<boolean>();
  phaseIds: number[] = new Array();

  ///owner
  owner: string;

  alive:boolean = true;
  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  loading: boolean = false;
  chartData;

  chartRef;
  
  constructor( public toastr: NbToastrService,private dataManagementService: DataManagementService,
     private graphService: GraphService, private layoutService:LayoutService) {
    this.owner = owner;
    this.onData.emit(false);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit() {
    this.layoutService.onChangeLayoutSize()
    .pipe(takeWhile(()=> this.alive))
    .subscribe(resp => {
      try {
       this.chartRef.reflow();
      } catch (error) { }
    });
   
  }


  timeZone() {
    switch (owner) {
      case 'ANME': 
      case 'KASSAB':
      case 'KASSAB2':
      case 'IOT':
      case 'INPUT':
        return new Date().getTimezoneOffset();
      case 'MEKATECH':
        return 0;
      default:
        return -60;
    }
  }

   getChart() {
    this.chartOptions = {
    time: {
      timezoneOffset: this.timeZone()
    },
    navigation: {
      buttonOptions: {
        enabled: true
      }
    },
    chart: {
  //      backgroundColor: 'rgba(0,0,0,0)',
      alignTicks: false,
      /* scrollablePlotArea: {
         minWidth: 900
       },*/
      zoomType: 'x'
    },
    title: {
      text: '',
    },
    xAxis: {
      type: "datetime",
      // minTickInterval:10
    },
    yAxis:this.loadYAxis(),
    legend: {
      align: 'left',
      verticalAlign: 'top',
      borderWidth: 0
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      useHTML: true
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500,
          minWidth: 200
        },
        chartOptions: {
          plotOptions: {
            series: {
              cursor: 'pointer',
              marker: {
                radius: 2.5
              },
            }
          }
        }
      }]
    },
    plotOptions: {
      series:{
               // gapSize: 5,
              // gapUnit: 'relative',
              connectNulls:true,
      }
    },
    series: this.chartData,
    accessibility: {
      enabled: false
    }
  }
}

  refresh() {
    try {
      let vect1, vect2: any[];
      let vect1Ids, vect2Ids: number[];
      let vars_tmp = [], installationName ='';
      this.loading = true;
      let yAxis: Unit = this.getUnit(this.vars[0]);
      if (this.vars[0] == "temperature" || this.vars[0] == "humidity") {
        this.sondeIds = new Array();
        this.sondes.forEach(sonde => {
          this.sondeIds.push(sonde.id);
        });
        if (this.sondes[0].configuration.indexOf('battery') > -1 && this.vars.indexOf('battery_percentage') < 0)
          this.vars.push('battery_percentage');
       // this.inputs = this.dataManagementService.selectedInstallation.inputs;
          vect1 = this.sondes; vect1Ids = this.sondeIds; vect2 = this.inputs; vect2Ids = this.inputs.map(i=>i.id); 
          vars_tmp = this.vars;
        //}
      }  else if (this.vars[0] == "in1") {
        vect1 = this.gazs; vect1Ids = this.groupIds; vect2 = null; vect2Ids = null; vars_tmp = this.vars;
      } else if (this.vars[0] == "point") {
        this.pointIds = this.points.map(p=> p.id);
        this.deviceIds = this.points.map(p => p.deviceId);
         vect1 = this.points ; vect1Ids = this.pointIds; vect2 = this.devices; vect2Ids = this.deviceIds; vars_tmp = this.vars;

      } else if (this.vars[0].startsWith("grouped_")) {
        this.phaseIds = new Array();
        if(this.dataManagementService.selectedInstallation.provider){
          this.phaseIds = [...this.dataManagementService.selectedInstallation.groupses,...this.dataManagementService.selectedInstallation.provider.groupses]
          .filter(g=> this.groupses.find(sg=>sg.id ==g.id) ).flatMap(g => g.phases ).map(p=> p.id);
        } else {
          this.phaseIds = [...this.dataManagementService.selectedInstallation.groupses]
          .filter(g=> this.groupses.find(sg=>sg.id ==g.id) )
          .flatMap(g => g.phases ).map(p=> p.id);
        }

        vect1 = this.groupses, vect1Ids = this.phaseIds;  vect2 = null, vect2Ids = null; vars_tmp =  this.vars ;
          
      } else if (this.vars[0].startsWith('IO_')) {
        vect1 = this.groupses; vect1Ids = this.groupIds; vect2 = null; vect2Ids = null; vars_tmp = this.vars;

      } else {
        this.phaseIds = new Array();
        if(this.dataManagementService.selectedInstallation.provider){
          this.phaseIds = [...this.dataManagementService.selectedInstallation.groupses,...this.dataManagementService.selectedInstallation.provider.groupses]
          .filter(g=> this.groupses.find(sg=>sg.id ==g.id) ).flatMap(g => g.phases ).map(p=> p.id);
        } else {
          this.phaseIds = [...this.dataManagementService.selectedInstallation.groupses]
          .filter(g=> this.groupses.find(sg=>sg.id ==g.id) ).flatMap(g => g.phases ).map(p=> p.id);
        }
          vect1 = this.groupses, vect1Ids = this.phaseIds;  vect2 = null, vect2Ids = null; 
          vars_tmp = this.vars;
      }
      try {
        installationName = this.dataManagementService.selectedInstallation.name
      } catch (error) {
        
      }

      this.graphService
            .loadSeries('DETAILS',  this.startDate, this.endDate, vect1, vect1Ids, this.period, null,
             vect2,vect2Ids, vars_tmp, yAxis, installationName)
            .pipe(take(1))
            .subscribe({
                next:(series) => {
                if (series.length == 0) {
                    this.toastr.warning("Pas de données à afficher");
                    this.loading = false;
                    try {  
                      while (this.chartRef.series.length) {
                        this.chartRef.series[0].destroy();
                        this.chartRef.redraw();
                      } 
                    } catch (error) { }
                } else {
                         
                  try {
                   // this.chartRef.series.forEach(s => {try { s.remove();} catch (error) {} });
                   while (this.chartRef.series.length) {
                    this.chartRef.series[0].destroy();
                  }
                    series.forEach(s=> this.chartRef.addSeries(s)); 
                    this.chartRef.redraw()
                  } catch (error) { 
                    this.chartData = [...series];
                    this.getChart(); 
                  }
                  
                    this.loading = false;
                    this.onData.emit(true);
                }
                },
                error:(err) => {
                    this.toastr.danger("Un probleme est survenu!");
                    this.loading = false;
                    try {  
                      while (this.chartRef.series.length) {
                        this.chartRef.series[0].destroy();
                        this.chartRef.redraw();
                      } 
                    } catch (error) { }
                },
                complete: () => {this.loading = false;
                }
            });
    } catch (e) {
    }

  }

  getPhaseName(idPhase: number) {
    for (let i = 0; i < this.groupses.length; i++) {
      for (let j = 0; j < this.groupses[i].phases.length; j++) {
        if (this.groupses[i].phases[j].id == idPhase)
          return this.groupses[i].phases[j].name;
      }
    }
  }

  getGroupName(idGroup: number) {
    for (let i = 0; i < this.groupses.length; i++) {
      if (this.groupses[i].id == idGroup)
        return this.groupses[i].name;
    }
  }
  getSondeName(idSonde: number) {
    for (let i = 0; i < this.sondes.length; i++) {
      if (this.sondes[i].id == +idSonde)
        return this.sondes[i].name;
    }
  }

  getGazName(idGaz: number) {
    for (let i = 0; i < this.gazs.length; i++) {
      if (this.gazs[i].id == +idGaz)
        return this.gazs[i].name;
    }
  }

  getStationName(idStation: number) {
    for (let i = 0; i < this.stations.length; i++) {
      if (Number(this.stations[i].id) == +idStation)
        return this.stations[i].name;
    }
  }

  getPointName(idPoint: number, idDevice: number) {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].id == +idPoint && this.points[i].deviceId == +idDevice)
        return this.points[i].label;
    }
  }

  getPoint(idPoint: number, idDevice: number) {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].id == +idPoint && this.points[i].deviceId == +idDevice)
        return this.points[i];
    }
  }

  private loadYAxis(): any[] {
    let yAxisArray = [];
    let yaxis;
    UNIT_Array.forEach((unit, index) => {
      if (unit == 'ONOFF') {
        yaxis = {
          alignTicks: false,
          allowDecimals: false,
          endOnTick: false,
          labels: {
            formatter: function () { return this.value == 1 ? '<label>FERME</label>' : this.value == 0 ? '<label>OUVERT</label>' : '<label></label>'; }
          },
          title: {
            text: null
          },
          opposite: false
        };
      } else {
        yaxis = {
          labels: {
            // align: 'left',
            x: 3,
            y: 16,
            format: '{value:.,0f}' + unit
          },
          title: {
            text: null
          },
          opposite: true
        };
      }
      yAxisArray.push(yaxis);
    });
    return yAxisArray;
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
    else if (vars.indexOf('power') > -1 ) {
      yAxis = Unit.Watt;
    }
    else if (vars.indexOf('voltage') > -1) {
      yAxis = Unit.Volt
    }
    return yAxis;
  }

  getSonde(idSonde: number, sondes?): Sonde {
    return this.sondes.find(s => s.id == idSonde);
  }

  chartCallback: Highcharts.ChartCallbackFunction = chart => {
    this.chartRef = chart;
  };
}
