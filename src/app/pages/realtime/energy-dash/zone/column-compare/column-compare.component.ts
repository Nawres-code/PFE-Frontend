import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Unit } from '../../../../../@core/data/comaparator';
import { DataManagementService } from '../../../../../@core/service/data-management.service';
import * as Highcharts from 'highcharts';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { DataRtDto } from '../../../../../@core/data/dataRtDto';
import { LayoutService } from '../../../../../@core/utils';

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
  selector: 'ngx-column-compare',
  templateUrl: './column-compare.component.html',
  styleUrls: ['./column-compare.component.scss']
})
export class ColumnCompareComponent implements OnInit, AfterContentInit {

  @Input() installationId: number =  null;
  data: number[] = [];

  alive:boolean = true;
  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;

  breakpoints: any;
  breakpoint: NbMediaBreakpoint;
  loading = true;
  constructor(private dataManagementService: DataManagementService, private layoutService:LayoutService,  private breakpointService: NbMediaBreakpointsService, private themeService: NbThemeService) { 
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
      for( let c of this.Highcharts.charts){ 
          try{
            if(c != undefined) 
            c.reflow();//.setSize(this.containerWidth,this.container.element.nativeElement.height);
            } catch(error){}
      }});
  }

  ngAfterContentInit(): void {
    // rt Management
    this.dataManagementService.DataLoaded$
    .pipe(takeWhile(() => this.alive))
    .subscribe(rtData => { 
      if(this.loadData(rtData)) 
        this.getChart();
      });
      try { 
      this.dataManagementService.DataLoaded$.emit(this.dataManagementService.dataRtDto);
    } catch (error) { }
  }

  ngOnInit() {
  }
  getChart() {
    // await delay(10);
     this.chartOptions = {
  accessibility:{
    enabled: false,
  },
  chart: {
      type: 'column',
      height: this.breakpoint? this.breakpoint.width >= this.breakpoints.md ? '75%' : '150%' : '75%', // '150%',
  },
   navigation: {
    buttonOptions: {
      enabled: false
    }
  },
  title: {
      text: ''
  },
  plotOptions: {
      series: {
          grouping: false,
          borderWidth: 0
      }
  },
  legend: {
      enabled: false
  },
  tooltip: {
      shared: true,
      headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} '+Unit.Kwh+'</b><br/>',
      valueDecimals: 2
  },
  xAxis: {
      type: 'category',
      max: 0,
      labels:{
              enabled: false
      }
  },
  credits: {
    enabled: false
  },
  yAxis: [{
      title: '',
      showFirstLabel: false
  }],
  series: [{
      data: [this.data[0]],
      color: 'rgb(158, 159, 163, 0.6)',
      pointPlacement: -0.2,
      linkedTo: 'main',
      name: 'Hier'
  }, {
      data: [this.data[1]],
      name: 'Aujourd\'hui',
      id: 'main',
      color: 'rgb(149,206,255)',
  }]
};
  }

  loadData(rtData:DataRtDto): boolean {
    try {
      this.loading = true;
      if(this.installationId != null)
        this.data = [rtData.lastDayInstallationsEnegies[this.installationId],rtData.zonesRtDto[this.dataManagementService.selectedZone?.idZone]?.installationsRtDto[this.installationId]?.eAct];
      this.loading = false;
      return true;
    } catch (error) { 
    }
    this.loading = false;
    return false;
  }
  
}
