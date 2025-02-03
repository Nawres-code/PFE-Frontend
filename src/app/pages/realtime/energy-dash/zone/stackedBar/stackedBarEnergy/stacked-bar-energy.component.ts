import { Component, OnInit, OnDestroy, AfterContentInit, Input } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as Highcharts from 'highcharts';
import { takeWhile } from 'rxjs/operators';
import { Unit } from '../../../../../../@core/data/comaparator';
import { Installation, Zone } from '../../../../../../@core/data/data';
import { DataRtDto, ZoneRtDto } from '../../../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../../../@core/service/data-management.service';
import { LayoutService } from '../../../../../../@core/utils';
import { orderByField } from '../../../../../../@core/utils/global/order';
import { owner } from '../../../../../../global.config';

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
  selector: 'ngx-stacked-bar-energy',
  templateUrl: './stacked-bar-energy.component.html',
  styleUrls: ['./stacked-bar-energy.component.scss']
})
export class StackedBarEnergyComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() zone: Zone = null;
  categoriesLbl: string[] = [];
  data: any[] = [];

  alive: boolean = true;
  chartOptions: any = null;
  Highcharts: typeof Highcharts = Highcharts;

  breakpoints: any;
  breakpoint: NbMediaBreakpoint;
  loading = true;
  series = [];

  constructor(private layoutService: LayoutService, private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService, private dataMangementService: DataManagementService) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([, newValue]) => {
        this.breakpoint = newValue;
      });


    this.layoutService.onSafeChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {
        for (let c of this.Highcharts.charts) {
          try {
            if (c != undefined)
              c.reflow();
          } catch (error) { }
        }
      });
       // rt Management
    this.dataMangementService.DataLoaded$
    .pipe(takeWhile(() => this.alive))
    .subscribe(rtData => {
      if (this.loadData(rtData))
        this.getChart();
    });
  }

  ngAfterContentInit(): void {
   
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit() { }

  getChart() {
    if (this.zone) {
      if (this.series.length == 0) {
        this.orderByName(this.getEnergyInstallation(this.dataMangementService.selectedZone.installations))
          .forEach(inst => {
            this.series.push({ data: [{ y: 0, custom: { tooltipVal: '0' } }], name: inst.name, showInLegend: false });
          });
      }

      this.chartOptions = {
        accessibility: {
          enabled: false,
        },
        chart: {
          backgroundColor: "var(--color-primary-transparent-100)",
          type: 'bar',
          height: this.breakpoint ? this.breakpoint.width >= this.breakpoints.md ? '8%' : '30%' : '30%',
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
          categories: ['Energy active'],//this.categoriesLbl,
          title: {
            text: null
          },
        },
        credits: {
          enabled: false
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
          pointFormat: '{point.series.name}: {point.custom.tooltipVal} ' + Unit.Kwh,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              format: '{point.series.name}: {point.custom.tooltipVal} ' + Unit.Kwh,
            }
          },
          column: {
            dataLabels: {
              enabled: true,
              pointFormat: '{point.custom.tooltipVal} ' + Unit.Kwh,
            }
          },
        },
        series: this.series,
      };
      this.loading = false;
    }
  }

  getGroupsData(rtData: DataRtDto): { y: number, custom: { tooltipVal: string } }[] {
    let groupsEAct: { y: number, custom: { tooltipVal: string } }[] = [];
    let val = 0;
    this.orderByName(this.dataMangementService.tenantData.zones)
      .map(zone => zone.idZone)
      .forEach(
        idZone => {
          try {
            val = rtData.zonesRtDto[idZone].eAct;
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

  getGroupsLbl() {
    let groupsLbl: string[] = [];
    groupsLbl = this.orderByName(this.dataMangementService.tenantData.zones)
      .map(zone => zone.name);
    return groupsLbl;
  }

  getInstallationData(rtZone: ZoneRtDto): { y: number, custom: { tooltipVal: string } }[] {
    let seriesEAct = [];
    this.series = [];
    try {
      let val = 0;
      this.orderByName(this.getEnergyInstallation(this.dataMangementService.selectedZone.installations))
        .map(inst => inst.id).forEach(instId => {
          let groupsEAct: { y: number, custom: { tooltipVal: string } }[] = [];
          try {
            if (rtZone) {
              val = rtZone.installationsRtDto[instId].eAct;
              groupsEAct.push(owner == 'TRICITY' || owner == 'ANME' || owner.includes('KASSAB') ? { y: val < 0 ? 0 : val, custom: { tooltipVal: val.toFixed(2) + '' } }
                : { y: val < 0 ? 0 : val, custom: { tooltipVal: Math.round(val) + '' } });
            }
          } catch (error) {
            groupsEAct.push({ y: 0, custom: { tooltipVal: '0' } });
          }
          seriesEAct.push({ data: groupsEAct, name: this.getInstallationNameById(instId), showInLegend: false });
        });
    } catch (error2) { }
    this.series = seriesEAct;
    return [];
  }

  getInstallationLbl() {
    let groupsLbl: string[] = [];
    try {
      groupsLbl = this.orderByName(this.getEnergyInstallation(this.dataMangementService.selectedZone.installations))
        .map(inst => inst.name);
    } catch (error) { }
    return groupsLbl;
  }

  getEnergyInstallation(installations: Installation[]) {
    try {
      return installations.filter(i => i.type == 'standard');
    } catch (error) { }
  }

  orderByName(array) {
    return orderByField(array, 'name');
  }

  loadData(rtData: DataRtDto): boolean {
    try {
      if (this.zone != null) {
        this.data = this.getInstallationData(rtData.zonesRtDto[this.zone.idZone]);
        // this.categoriesLbl = this.getInstallationLbl();
      } else {
        this.data = this.getGroupsData(rtData);
        this.categoriesLbl = this.getGroupsLbl();
      }
      return true;
    } catch (error) { }
    return false;
  }

  getInstallationNameById(id: number): string {
    try {
      return this.zone.installations.find(inst => inst.id == id).name;
    } catch (error) {
      return null;
    }
  }

}
