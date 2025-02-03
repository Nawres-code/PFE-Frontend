import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { take, takeWhile } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { Inputs, Sonde } from '../../@core/data/data';
import { owner } from '../../global.config';
import { Unit, UNIT_Array } from '../../@core/data/comaparator';
import { GraphService } from '../../@core/service/graph.service';
import { LayoutService } from '../../@core/utils';
import { interval } from 'rxjs';

declare var require: any;
const hc = require('highcharts');
const Boost = require('highcharts/modules/boost');
const exporting = require('highcharts/modules/exporting');
const More = require('highcharts/highcharts-more');
const exportData = require('highcharts/modules/export-data');

Boost(hc);
exporting(hc);
exportData(hc);
More(hc);

@Component({
  selector: 'gps-graph',
  templateUrl: './gps-graph.component.html',
  styleUrls: ['./gps-graph.component.scss']
})
export class GpsGraphComponent implements OnInit, OnDestroy {
  //select group
  sondeIds: number[] = new Array();
  @Input()
  sondes: Sonde[] = new Array();
  //date
  @Input()
  startDate: Date = new Date();
  @Input()
  endDate: Date = new Date();
  @Input()
  vars: string[] = new Array();

  @Input()
  idDiv: String

  @Input('inst-name')
  installationName: string

  @Input()
  idDivPrefix: string = '';

  @Input()
  inputs: Inputs[] = [];

  @Input()
  renderInputBar: boolean = true;

  dropdownList = [];

  owner : string;
  containerWidth: number = 0;
  alive : boolean = true;

  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartData;


  constructor( 
    public toastr: NbToastrService,private layoutService: LayoutService, private graphService: GraphService) { 
    this.owner = owner;
  }

  ngOnInit() {
    this.refresh();
    const s = interval(30000);
    s.pipe(takeWhile(()=> this.alive))
    .subscribe(data => {
        this.refresh();
    });

    this.layoutService.onChangeLayoutSize()
    .pipe(takeWhile(()=> this.alive))
    .subscribe(resp => {
      try {
        for( let c of this.Highcharts.charts){ 
          try {
            if(c != undefined) 
            c.reflow();
          } catch(error) {}
      }
      } catch (error) { }
    });
  }

  async getChart() {
    this.chartOptions = {
    exporting: {
      enabled: false
    },
    time:{
      timezoneOffset: owner =='IOT'|| owner =='DEPOT'
      ||owner =='FLEETDEPOT'|| owner =='INPUT'? new Date().getTimezoneOffset():0
    },
    chart: {
      backgroundColor: 'rgba(0,0,0,0)',
      alignTicks: false,
      zoomType: 'x',
      resetZoomButton: {
        position: {
             align: 'left', // by default
           //  verticalAlign: 'top'
        }
      }
    },

    title: {
      text: 'Details Graph',
      style: {
        display: 'none'
      }
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: this.loadYAxis(),
    
    legend: {
      enabled: false,
    },

    tooltip: {
      shared: true,
      crosshairs: true
    },

    credits: {
      enabled: false
    },
    
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {

        },
        marker: {
          lineWidth: 1
        }
      },
      areaspline: {
        fillOpacity: 0.2
    }
    },
    series: this.chartData,
    accessibility: {
      enabled: false
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 400
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          subtitle: {
            text: null
          },
          credits: {
            enabled: false
          }
        }
      }]
    }
  }
}

  refresh() {
    this.startDate = new Date(); this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date(); this.endDate.setHours(23, 59, 59, 0);

    let vect1, vect2: any[];
    let vect1Ids, vect2Ids: number[];
    let vars_tmp = [];

    let period = '5min';
    if (owner == 'MEKATECH' || owner == 'MEKATECHNOAUTH') {
      period = '1min';
    } else if(owner == 'INPUT') {
      period = '1min'; //this.sondeIds.push(1234);
    }

    let yAxis: Unit = this.getUnit(this.vars[0]);
    this.sondeIds = new Array();
    this.sondes.forEach(sonde => {
      this.sondeIds.push(sonde.id);
    });
    if(this.sondes[0] && this.sondes[0].configuration.indexOf('battery') > -1 && this.vars.indexOf('battery_percentage') < 0)
      this.vars.push('battery_percentage');
      if(this.sondes[0] && this.sondes[0].configuration.indexOf('humidity') > -1 && this.vars.indexOf('humidity') < 0)
      this.vars.push('humidity');

      vect1 = this.sondes; vect1Ids = this.sondeIds; vect2 = this.inputs; vect2Ids = this.inputs.map(i=>i.id); 
      vars_tmp = this.vars;

      this.graphService
          .loadSeries('DETAILS',  this.startDate, this.endDate, vect1, vect1Ids, period, null,
           vect2,vect2Ids, vars_tmp, yAxis, this.installationName)
          .pipe(take(1))
          .subscribe({
              next:(series) => {
                if (series.length == 0) {
                    try { this.chart.destroy(); } catch (error) {}
                } else {
                    this.chartData = series;
                    this.getChart();
             // ##
                  }
              },
              error:(err) => {
                  this.toastr.danger("Un probleme est survenu!");
                  try { this.chart.destroy(); } catch (error) {}
              },
              complete: () => { }
          });
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
  getSondeName(idSonde: number) {
    for (let i = 0; i < this.sondes.length; i++) {
      if (this.sondes[i].id == idSonde)
        return this.sondes[i].name;
    }
  }

  getSonde(idSonde: number): Sonde {
    return this.sondes.find(s=> s.id == idSonde);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  toogleSeries(input:{status: boolean, name: string}) {
    input.name = input.name=='door'? 'porte': input.name;
    this.Highcharts.charts
    .filter(c => c != undefined)
    .filter (c => 
      { 
        let s = c.series.filter(s => s.name.indexOf(this.installationName) > -1
         && s.name.indexOf(input.name) > -1)[0];
        if(s != undefined){
          if (input.status) {
            s.show();
          } else {
            s.hide();
          }
        }
      });
  }
  private loadYAxis(): any[] {
    let yAxisArray = [];
    let yaxis;
    UNIT_Array.forEach((unit, index) => {
      if (unit == 'ONOFF') {
        yaxis = {
          visible: false,
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
            x: 0,
            y: 0,
            format: '{value:.,0f}' + unit
          },
          title: {
            text: null
          },
          opposite: index % 2 != 0
        };
      }
      yAxisArray.push(yaxis);
    });
    return yAxisArray;
  }
    
  callbackFunction = () => {
    try {
      if (this.inputs.length > 0 && owner != 'INPUT') {
        let inputCache;
        inputCache = localStorage.getItem('rtInput');
        if (inputCache == null) { inputCache = ''; }
        this.inputs.forEach(inpt => {
          let obj = { status: inputCache.indexOf(' ' + inpt.id + ',') > -1,
          name: inpt.name };
          this.toogleSeries(obj);
        });
      }
    } catch (e) { }
  };
}

