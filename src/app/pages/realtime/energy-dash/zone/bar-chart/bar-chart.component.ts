import { Component, OnInit, Input, OnDestroy, AfterContentInit } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as Highcharts from 'highcharts';
import { takeWhile } from 'rxjs/operators';
import { Unit } from '../../../../../@core/data/comaparator';
import { Installation, Zone } from '../../../../../@core/data/data';
import { DataRtDto, InstallationRtDto, ZoneRtDto } from '../../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../../@core/service/data-management.service';
import { LayoutService } from '../../../../../@core/utils';
import { orderByField } from '../../../../../@core/utils/global/order';
import { owner } from '../../../../../global.config';

@Component({
  selector: 'ngx-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnDestroy, AfterContentInit {

  @Input() installation: Installation = null;
  @Input() zone: Zone = null;

  categoriesLbl: string[] = [];
  data: { y: number, custom: { tooltipVal: string } }[] = [];
  colors: string[]
  barType: string;

  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;

  breakpoints: any;
  breakpoint: NbMediaBreakpoint;

  loading = true;
  alive: boolean = true;

  constructor(private layoutService: LayoutService, private dataMangementService: DataManagementService, private breakpointService: NbMediaBreakpointsService, private themeService: NbThemeService) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.barType = owner == 'ANME' || owner.includes('KASSAB') ? 'column' : 'bar';


    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([, newValue]) => {
        this.breakpoint = newValue;
      });

    this.layoutService.onSafeChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {
        //   let cont = undefined;
        for (let c of this.Highcharts.charts) {
          try {
            if (c != undefined)
              c.reflow();//.setSize(this.containerWidth,this.container.element.nativeElement.height);
          } catch (error) { }
        }
      });
  }

  ngAfterContentInit(): void {
    this.dataMangementService.DataLoaded$
      .pipe(takeWhile(() => this.alive))
      .subscribe(rtData => {
        if (this.loadData(rtData))
          this.getChart();
      });
    try {
      this.dataMangementService.DataLoaded$.emit(this.dataMangementService.dataRtDto);
    } catch (error) { }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit() { }

  async getChart() {

    this.chartOptions = {
      accessibility: {
        enabled: false,
      },
      chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        type: this.barType,
        height: this.breakpoint ? this.breakpoint.width >= this.breakpoints.md && this.barType == 'column' ? '20%' : '50%' : '50%',
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
        }
      },
      yAxis: {
        min: 0,
        gridLineWidth: 0,
        title: {
          text: null
        },
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueDecimals: 2,
        pointFormat: '{point.custom.tooltipVal} ' + Unit.Kwh,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            pointFormat: '{point.custom.tooltipVal} ' + Unit.Kwh,
          }
        },
        column: {
          dataLabels: {
            enabled: true,
            pointFormat: '{point.custom.tooltipVal} ' + Unit.Kwh,
          }
        },
        series: {
          colorByPoint: true,
          colors: this.colors,
        },
      },
      credits: {
        enabled: false
      },
      series: [{
        data: this.data,
        showInLegend: false,
        name: 'Energy journalière'
      }]
    };
    if (this.barType == 'bar') {
      this.chartOptions.chart.width = 320;
    }
    this.loading = false;
  }

  loadData(rtData: DataRtDto): boolean {
    try {
      if (this.installation != null) {
        this.categoriesLbl = this.getGroupsLbl(rtData.zonesRtDto[this.dataMangementService.selectedZone?.idZone]?.installationsRtDto[this.installation.id], this.installation);
        this.data = this.getGroupsData(rtData.zonesRtDto[this.dataMangementService.selectedZone?.idZone]?.installationsRtDto[this.installation.id], this.installation);
        this.colors = this.getGroupsColors(rtData.zonesRtDto[this.dataMangementService.selectedZone?.idZone]?.installationsRtDto[this.installation.id], this.installation);
      }
      if (this.zone != null) {
        this.categoriesLbl = this.getCatLbl(rtData.zonesRtDto[this.zone.idZone], this.zone);
        this.data = this.getCatData(rtData.zonesRtDto[this.zone.idZone], this.zone);
        this.colors = this.getCatColors(rtData.zonesRtDto[this.zone.idZone], this.zone);
      }
      return true;
    } catch (error) { }
    return false;
  }

  getGroupsLbl(rtInstallation: InstallationRtDto, installation: Installation) {
    let groupsLbl: string[] = [];
    let childIds = installation.groupses.filter(gr => gr.type != 'General').flatMap(gr => gr['children']).flatMap(g => g.id);
    switch (owner) {
      case 'KASSAB':
        case 'KASSAB2':
      case 'ANME':
        groupsLbl = this.orderByName(installation.groupses.filter(g => g.type != 'General' && childIds.indexOf(g.id) < 0)).map(g => g.name);
        groupsLbl.push('Autres');
        break;
      default:
        try {
          const catIds: number[] =
            owner == 'AZIZA' ? this.dataMangementService.tenantData.categories.map(cat => cat.id) :
              Object.keys(rtInstallation.eActPerCat).map(i => +i).sort();
          groupsLbl = this.dataMangementService.tenantData.categories
            .filter(cat => cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
            .filter(cat => catIds.indexOf(cat.id) > 0)
            .map(cat => cat.name);
          groupsLbl.push('Autres');
        } catch (error) { }
        break;
    }
    return groupsLbl;
  }

  getGroupsData(rtInstallation: InstallationRtDto, installation): { y: number, custom: { tooltipVal: string } }[] {
    let groupsEAct: { y: number, custom: { tooltipVal: string } }[] = [];
    let val = 0, sum = 0;
    let childIds = installation.groupses.filter(g => g.type != 'General')
      .flatMap(g => g.children).flatMap(g => g.id);
    switch (owner) {
      case 'KASSAB':
        case 'KASSAB2':
      case 'ANME':
        const catIds: number[] = this.orderByName(installation.groupses
          .filter(g => g.type != 'General' && childIds.indexOf(g.id) < 0)).map(g => g.id);
        try {
          catIds.forEach(id => {
            try {
              val = rtInstallation.groupsRtDto[id].eAct;
              sum += val;
              groupsEAct.push({
                y: val < 0 ? 0 : val,
                custom: { tooltipVal: Math.round(val) + '' }
              });
            } catch (error) {
              groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } });
            }
          });
        } catch (error) { }

        try {
          val = rtInstallation.groupsRtDto[installation.groupses.find(g => g.type == 'General').id].eAct - sum;
          groupsEAct.push({
            y: val < 0 ? 0 : val,
            custom: { tooltipVal: Math.round(val) + '' }
          });
        } catch (error) {
          groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } });
        }
        break;
      default:
        try {
          const catIds: number[] =
            owner == 'AZIZA' ? this.dataMangementService.tenantData.categories.map(cat => cat.id) :
              Object.keys(rtInstallation.eActPerCat).map(i => +i).sort();
          this.dataMangementService.tenantData.categories
            .filter(cat => cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
            .filter(cat => catIds.indexOf(cat.id) > 0)
            .map(cat => cat.id).forEach(
              idCat => {
                try {
                  val = rtInstallation.eActPerCat[idCat].eAct;
                  groupsEAct.push({
                    y: val < 0 ? 0 : val,
                    custom: { tooltipVal: Math.round(val) + '' }
                  });
                } catch (error) {
                  groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } });
                }
              });
        } catch (error) { }

        try {
          val = rtInstallation.eActPerCat[this.dataMangementService.tenantData.categories.find(cat => cat.name.toLowerCase() == 'autres').id].eAct;
          groupsEAct.push({
            y: val < 0 ? 0 : val,
            custom: { tooltipVal: Math.round(val) + '' }
          });
        } catch (error) {
          if (groupsEAct.length > 0) { groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } }); }
        }
        break;
    }

    return groupsEAct;
  }

  getGroupsColors(insatllationRt: InstallationRtDto, installation: Installation): string[] {
    let groupsLbl: string[] = [];
    let childIds = installation.groupses.filter(gr => gr.type != 'General').flatMap(gr => gr['children']).flatMap(g => g.id);
    switch (owner) {
      case 'ANME':
      case 'KASSAB':
        case 'KASSAB2':
        const catIds: number[] =
          this.orderByName(installation.groupses.filter(g => g.type != 'General' && childIds.indexOf(g.id) < 0))
          .map(g => g.categoryId);
        try {
          catIds.forEach(id =>
            groupsLbl.push(this.dataMangementService.tenantData.categories.find(cat => cat.id == id).color));
        } catch (error) { }
        try {
          groupsLbl.push(this.dataMangementService.tenantData.categories.find(cat => cat.name.toLowerCase() == 'autres').color);
        } catch (error) { }
        break;
      default:
        try {
          const catIds: number[] =
            owner == 'AZIZA' ? this.dataMangementService.tenantData.categories.map(cat => cat.id) :
              Object.keys(insatllationRt.eActPerCat).map(i => +i).sort();
          groupsLbl = this.dataMangementService.tenantData.categories
            .filter(cat => cat.name.toLowerCase() != 'general' && cat.name.toLowerCase() != 'pv' && cat.name.toLowerCase() != 'autres')
            .filter(cat => catIds.indexOf(cat.id) > 0)
            .map(cat => cat.color);
        } catch (error) { }
        try {
          groupsLbl.push(this.dataMangementService.tenantData.categories.find(cat => cat.name.toLowerCase() == 'autres').color);
        } catch (error) { }
        break;
    }
    return groupsLbl;
  }

  getCatColors(zoneRt: ZoneRtDto, zone: Zone): string[] {
    let groupsCalors: string[] = [];
    groupsCalors = this.dataMangementService.tenantData.categories
      .filter(cat => cat.name != 'General' && cat.name != 'PV')
      .sort(function (a, b) {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      }).map(cat => cat.color)
    return groupsCalors;
  }

  getCatData(zoneRt: ZoneRtDto, zone: Zone): { y: number, custom: { tooltipVal: string } }[] {
    let groupsEAct: { y: number, custom: { tooltipVal: string } }[] = [];
    let val = 0;
    this.dataMangementService.tenantData.categories
      .filter(cat => cat.name != 'General' && cat.name != 'PV')
      .map(cat => cat.id).sort().forEach(
        idCat => {
          try {
            val = zoneRt.eActPerCat[idCat].eAct;
            groupsEAct.push({
              y: val < 0 ? 0 : val,
              custom: { tooltipVal: Math.round(val) + '' }
            });
          } catch (error) {
            groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } });
          }
        });
    return groupsEAct;
  }

  getCatLbl(zoneRt: ZoneRtDto, zone: Zone) {
    let groupsLbl: string[] = [];
    groupsLbl = this.dataMangementService.tenantData.categories
      .filter(cat => cat.name != 'General' && cat.name != 'PV')
      .sort(function (a, b) {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      }).map(cat => cat.name)
    return groupsLbl;
  }

  orderByName(array: any[]) {
    return orderByField(array, 'name');
  }

  // getCatColors(dataManagementService.dataRtDto.zonesRtDto[zone.idZone], zone)"
  // [data]="getCatData(dataManagementService.dataRtDto.zonesRtDto[zone.idZone], zone)"
  // [categoriesLbl]="getCatLbl(dataManagementService.dataRtDto.zonesRtDto[zone.idZone], zone)"

  // [colors]="getCatColors(dataManagementService.dataRtDto.zonesRtDto[dataManagementService.selectedZone?.idZone]?.installationsRtDto[installation.id], installation)"
  // [data]="getGroupsData(dataManagementService.dataRtDto.zonesRtDto[dataManagementService.selectedZone?.idZone]?.installationsRtDto[installation.id], installation)"
  // [categoriesLbl]="getGroupsLbl(dataManagementService.dataRtDto.zonesRtDto[dataManagementService.selectedZone?.idZone]?.installationsRtDto[installation.id], installation)"


}
