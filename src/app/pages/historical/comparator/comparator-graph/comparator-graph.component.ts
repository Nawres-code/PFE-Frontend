import { Component, OnInit, OnChanges, Input, SimpleChanges, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { owner } from '../../../../global.config';
import { GraphData, UNIT_Array } from '../../../../@core/data/comaparator';
import { GraphService } from '../../../../@core/service/graph.service';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import * as Highcharts from 'highcharts';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils';

// declare var require: any;
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
  selector: 'app-comparator-graph',
  templateUrl: './comparator-graph.component.html',
  styleUrls: ['./comparator-graph.component.scss']
})
export class ComparatorGraphComponent implements OnInit, OnChanges, OnDestroy{

  @Input()
  graphs: GraphData = null;

  @ViewChild('refComparator', {read: ViewContainerRef}) 
  container: ViewContainerRef;

  chart: Highcharts.Chart;
  owner = owner;
  containerWidth: number = 0;
  alive:boolean = true;
  remove:boolean = true;
  constructor(private graphService: GraphService, private dataManagementService: DataManagementService, private layoutService:LayoutService) { }
 

  ngOnInit() {
    this.options['yAxis']= this.loadYAxis();
    // this.chart = Highcharts.chart('comp-container', this.options);
    this.layoutService.onChangeLayoutSize().pipe(takeWhile(()=> this.alive))
    .subscribe(resp => {
        if (this.chart != undefined && this.container!= undefined) {
          try { this.chart.reflow();} catch (error) {}
          // this.chart.setSize(this.container.element.nativeElement.offsetWidth,
          //   this.container.element.nativeElement.offsetHeight, true);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.graphs) {
      let series_temp:any[]= [];
      if(this.graphs != null) {
        try {
          this.options['series']= [...this.chart.options.series, ...this.graphs.series];// series_temp;
        } catch (error) {
          this.options['series']= [ ...this.graphs.series];// series_temp;
        }
        try {
          this.chart = Highcharts.chart('comp-container', this.options);
        } catch (error) { }
        
      } else if(this.chart != undefined){    
          this.chart.destroy();
      } 
    }
  }
  
   options: any = {
    time: {
      timezoneOffset: this.timeZone(),
    },
    
    navigation: {
      buttonOptions: {
          enabled: true
      }
    },
    accessibility:{
      enabled: false,
    },

    chart: {
      zoomType: 'x',
      alignTicks: false,
      animation: {
        duration: 1000
      }
    },
    title: {
      text: 'Comparateur\'s Graph',
      style: {
        display: 'none'
      }
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: [],
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
    plotOptions: {
      series: {
        cursor: 'pointer',
        marker: {
          lineWidth: 1
        }
      }                  
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
              }
            }
          }
        }
      }]
    },
    series: []
  }
  
  private loadYAxis(): any[] {
    let yAxisArray = [];
    let unitArray = [];

    switch (owner) {
      case 'METOS':
        if(this.dataManagementService.tenantData.sensors.length > 0 ) {
          unitArray.push(...this.dataManagementService.tenantData.sensors.map(s => this.graphService.unitSensorPipe(s)));
        } else {
          this.dataManagementService.getAllMetosSensors().subscribe(
            sensors =>{
                unitArray.push(...sensors.map(s => this.graphService.unitSensorPipe(s)));
                this.ngOnInit();
            });
        }
        break;
      default:
        unitArray = UNIT_Array;
        break;
    }

    unitArray.forEach((unit, index) => {
      let  yaxis;
      if (unit == 'ONOFF') {
        yaxis = {
          alignTicks: false,
          allowDecimals: false,
          endOnTick: false,
          labels: {
            formatter: function () { return this.value == 1 ? '<label>ON</label>' : this.value == 0 ? '<label>OFF</label>' : '<label></label>'; }
          },
          title: {
            text: null
          },
          opposite: false
        };
      } else {
       yaxis = {
        labels: {
          format: '{value}' + unit
        },
        title: {
          text: null
        },
        opposite: index % 2 == 0
      };
    }
      yAxisArray.push(yaxis);
    }); 
    return yAxisArray;
  }

  ngOnDestroy(): void {
    this.alive = false
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
        return new Date().getTimezoneOffset();
    }
  }
  
}
