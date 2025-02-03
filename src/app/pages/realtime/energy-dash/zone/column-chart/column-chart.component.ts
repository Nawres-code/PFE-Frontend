import { Component, OnInit, OnDestroy, AfterContentInit, Input} from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as Highcharts from 'highcharts';
import {  takeWhile } from 'rxjs/operators';
import { Unit } from '../../../../../@core/data/comaparator';
import { Installation, Zone } from '../../../../../@core/data/data';
import { DataRtDto, ZoneRtDto } from '../../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../../@core/service/data-management.service';
import { LayoutService } from '../../../../../@core/utils';
import { orderByField } from '../../../../../@core/utils/global/order';
import { owner } from '../../../../../global.config';

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
  selector: 'ngx-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() zone: Zone = null;
  categoriesLbl: string[] = [];
  data: any[] = [];

  alive:boolean = true;
  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;

  breakpoints: any;
  breakpoint: NbMediaBreakpoint;
  loading = true;

  constructor(private layoutService:LayoutService,  private breakpointService: NbMediaBreakpointsService, private themeService: NbThemeService,   private dataMangementService: DataManagementService) { 
  
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
    this.dataMangementService.DataLoaded$
    .pipe(takeWhile(() => this.alive))
    .subscribe(rtData => { 
      if(this.loadData(rtData)) 
        this.getChart();
     });
     try { 
      this.dataMangementService.DataLoaded$.emit(this.dataMangementService.dataRtDto);
    } catch (error) { }
  }

  ngOnDestroy(): void {
    this.alive = false;  
  }

  ngOnInit() {  }

   getChart() {
   // await delay(10);
    this.chartOptions = {
      accessibility:{
        enabled: false,
      },
      chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'column',
        height: this.breakpoint? this.breakpoint.width >= this.breakpoints.md ? '15%' : '50%' : '15%',
      },
      title: {
        text: ''
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
        categories: this.categoriesLbl,
        title: {
          text: null
        },
  
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
        pointFormat: '{point.custom.tooltipVal} '+Unit.Kwh,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            pointFormat: '{point.custom.tooltipVal} '+Unit.Kwh,
          }
        },
      },
      series: [{
        data: this.data,
        showInLegend: false,
        color: "var(--text-primary-color)",
      }]
    };
    this.loading = false;
  }


  getGroupsData(rtData: DataRtDto): {y:number, custom:{tooltipVal:string}}[] {
    let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
    let val= 0;
    this.orderByName(this.dataMangementService.tenantData.zones)
    .map(zone=> zone.idZone)
    .forEach(
      idZone => {
        try {
          val = rtData.zonesRtDto[idZone].eAct;
          groupsEAct.push({y:val<0?0: val,
            custom:{tooltipVal:Math.round(val)+''}});
        } catch (error) {
          groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
        }
      });
    return groupsEAct;
  }

  getGroupsLbl() {
    let groupsLbl: string[] = [];
    groupsLbl = this.orderByName(this.dataMangementService.tenantData.zones)
    .map(zone=> zone.name);
    return groupsLbl;
  }

  getInstallationData(rtZone: ZoneRtDto): {y:number, custom:{tooltipVal:string}}[] {
    let groupsEAct: {y:number, custom:{tooltipVal:string}}[] = [];
    try {
    let val= 0;
    this.orderByName(this.getEnergyInstallation(this.dataMangementService.selectedZone.installations)).map(inst => inst.id).forEach(instId =>{
        try {
          val = rtZone.installationsRtDto[instId].eAct;
         groupsEAct.push(owner =='TRICITY' || owner =='ANME' || owner.includes('KASSAB')?{y:val<0?0: val,custom:{tooltipVal:val.toFixed(2)+''}}
           :{y:val<0?0: val,custom:{tooltipVal:Math.round(val)+''}});
       } catch (error) {
         groupsEAct.push({y:0, custom:{tooltipVal:'0'}});
       }
      });
    } catch (error2) { }
  return groupsEAct;
}

getInstallationLbl() {
  let groupsLbl: string[] = [];
  try {
  groupsLbl =  this.orderByName(this.getEnergyInstallation(this.dataMangementService.selectedZone.installations))
  .map(inst => inst.name);
  } catch (error) {}
  return groupsLbl;
}

getEnergyInstallation(installations: Installation[]){
  try {
    return installations.filter(i=> i.type =='standard');
  } catch (error) { }
}


  orderByName(array) {
    return  orderByField(array, 'name');
  }

  loadData(rtData:DataRtDto): boolean {
    try {
      if(this.zone != null){
        this.data = this.getInstallationData(rtData.zonesRtDto[this.zone.idZone]);
        this.categoriesLbl = this.getInstallationLbl();
      } else {
        this.data = this.getGroupsData(rtData);
        this.categoriesLbl = this.getGroupsLbl();
      }
      return true;
    } catch (error) { }
    return false;
  }
  
}
