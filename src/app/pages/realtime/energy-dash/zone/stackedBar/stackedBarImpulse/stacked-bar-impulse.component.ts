import { Component, OnInit, OnDestroy, AfterContentInit, Input} from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as Highcharts from 'highcharts';
import { timer } from 'rxjs';
import {  takeWhile } from 'rxjs/operators';
import { Unit } from '../../../../../../@core/data/comaparator';
import { Zone } from '../../../../../../@core/data/data';
import { DataManagementService } from '../../../../../../@core/service/data-management.service';
import { LayoutService } from '../../../../../../@core/utils';
import { orderByField } from '../../../../../../@core/utils/global/order';

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
  selector: 'ngx-stacked-bar-impulse',
  templateUrl: './stacked-bar-impulse.component.html',
  styleUrls: ['./stacked-bar-impulse.component.scss']
})
export class StackedBarImpulseComponent implements  OnDestroy {
  @Input() zone: Zone = null;
  @Input() ioType = null;
  rtSum: number = 0;
  categoriesLbl: string[] = [];
  data: any[] = [];

  alive:boolean = true;
  chartOptions: any = null;
  Highcharts: typeof Highcharts = Highcharts;

  breakpoints: any;
  breakpoint: NbMediaBreakpoint;
  loading = true;
  series = [];

  constructor(private layoutService:LayoutService,  private breakpointService: NbMediaBreakpointsService,
     private themeService: NbThemeService,   private dataMangementService: DataManagementService) { 

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
    .pipe(takeWhile(() => this.alive))
    .subscribe(([, newValue]) => {
      this.breakpoint = newValue;
     });

    this.layoutService.onSafeChangeLayoutSize()
    .pipe(takeWhile(()=>this.alive))
    .subscribe(resp => {  
    //   let cont = undefined;
      for( let c of this.Highcharts.charts) { 
          try{
            if(c != undefined) 
            c.reflow();//.setSize(this.containerWidth,this.container.element.nativeElement.height);
            } catch(error){}
      }});
      this.dataMangementService.GroupsLoaded$
        .pipe(takeWhile(() => this.alive))
        .subscribe(tenantData => {
      this.loadData();
        });
    timer(0, 20000) // every 1 minute
    .pipe(takeWhile(() => this.alive))
    .subscribe(val => this.loadData());
    
  }

  loadData() {
      this.dataMangementService.getAllRtIo('day')
      .subscribe( resp => {
        try {
        let seriesEAct = [];
        this.rtSum = 0;
        this.zone.installations
      .flatMap(inst => inst.ioList)
      .filter(ioItem => ioItem.type == this.ioType )
      .forEach(ioItem => {
        try {
          seriesEAct.push(
            {data:[{y: Math.round((resp[ioItem.id].value) * 100) / 100, custom: { tooltipVal:  (Math.round((resp[ioItem.id].value) * 100) / 100) + '' }}]
            , name: ioItem.name
            , showInLegend: false});
            this.rtSum += resp[ioItem.id].value;
            this.dataMangementService.eventIOTot.emit({'gaz':this.rtSum});
        } catch (error) { 
           seriesEAct.push({data:[{y: 0, custom: { tooltipVal: 0 + '' }}], name:ioItem.name, showInLegend: false}); }
        });
        this.series = seriesEAct;
      } catch (error) { }
      this.getChart();
      });
  }

  ngOnDestroy(): void {
    this.alive = false;  
  }

   getChart() {
    if(this.zone) {
   // await delay(10);
    this.chartOptions = {
      accessibility:{
        enabled: false,
      },
      chart: {
        backgroundColor:"var(--color-success-transparent-100)", 
        type: 'bar',
        height: this.breakpoint? this.breakpoint.width >= this.breakpoints.md ? '8%' : '30%' :  '30%',
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
       },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      xAxis: {
        scrollbar: {
          enabled: true
        },
        categories: [this.ioType],//this.categoriesLbl,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        gridLineWidth: 0,
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueDecimals: 2,
        pointFormat: '{point.series.name}: {point.custom.tooltipVal} ' + Unit.M3,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            format: '{point.series.name}: {point.custom.tooltipVal} ' + Unit.M3,
          } 
        },
        column: {
          dataLabels: {
            enabled: true,
            pointFormat: '{point.series.name}: {point.custom.tooltipVal} ' + Unit.M3,
          }
        },
      },
      series : this.series,
    };
    this.loading = false;
  }
  }

  orderByName(array) {
    return  orderByField(array, 'name');
  }

}
