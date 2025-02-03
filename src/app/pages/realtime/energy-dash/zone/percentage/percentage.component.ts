import { Component, OnInit, Input, OnDestroy, AfterContentInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { takeWhile } from 'rxjs/operators';
import { Category, Group, Installation, Zone } from '../../../../../@core/data/data';
import { DataRtDto } from '../../../../../@core/data/dataRtDto';
import { DataManagementService } from '../../../../../@core/service/data-management.service';

@Component({
  selector: 'percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss'],
})
export class PercentageComponent implements OnDestroy, AfterContentInit {
  private alive = true;
  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;


  value: number = 0;
  total: number = 1;
  name: string = '';
  color: string = "var(--text-primary-color)";

  @Input() width: number = 250;
  @Input() group: Group = null;
  @Input() category: Category = null;
  @Input() installation: Installation = null;
  @Input() zone: Zone = null;

  constructor(private dataMangementService: DataManagementService) { }

  ngAfterContentInit(): void {
    // rt Management
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

  getChart() {
    this.chartOptions = {
      accessibility: {
        enabled: false,
      },
      chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'pie',
        backgroundcolor: null,
        height: '50%', // 16:9 ratio
        width: this.width,
        margin: [0, 0, 0, 0],
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      title: {
        widthAdjust: 0,
        verticalAlign: 'middle',
        floating: true,
        text: Math.round(this.value / this.total * 100) + "%",
        style: {
          "fontSize": "12px"
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '70%',
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [{
        data: [{
          y: +Math.round(this.value * 100) / 100,
          name: this.name,
          color: this.color
        }, {
          y: +Math.round((this.total - this.value) * 100) / 100,
          name: "Others",
          color: 'rgba(209,223,236,0.2)'
        }]
      }],
      exporting: {
        enabled: false
      }
    };
  }


  loadData(rtData: DataRtDto): boolean {
    try {
      if (this.group != null) {
        this.value = rtData.zonesRtDto[this.dataMangementService.selectedZone.idZone]?.installationsRtDto[this.dataMangementService.selectedInstallation.id]?.groupsRtDto[this.group.id]?.eAct;
        this.total = rtData.zonesRtDto[this.dataMangementService.selectedZone.idZone]?.installationsRtDto[this.dataMangementService.selectedInstallation.id]?.eAct;
        this.name = this.group.name;
        this.color = this.getGroupCat(this.group).color;
      } else if (this.category != null && this.zone!= null) {
        this.color = this.category.color;
        this.value = rtData.zonesRtDto[this.zone.idZone].eActPerCat[this.category.id]?.eAct;
        this.total = rtData.zonesRtDto[this.zone.idZone].eAct;
        this.name = this.category.name;
      } else if (this.category != null) {
        this.color = this.category.color;
        this.value = rtData.eActPerCat[this.category.id]?.eAct;
        this.total = rtData.eAct;
        this.name = this.category.name;
      } else if (this.installation != null) {
        this.value = rtData.zonesRtDto[this.dataMangementService.selectedZone?.idZone]?.installationsRtDto[this.installation.id]?.eAct
        this.total = rtData.zonesRtDto[this.dataMangementService.selectedZone?.idZone]?.eAct;
        this.name = this.installation.name;
      } else if(this.zone != null) {
        this.value = rtData.zonesRtDto[this.zone.idZone]?.eAct;
        this.total = rtData.eAct;
        this.name = this.zone.name;
      }
      return true;
    } catch (error) { }
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  getGroupCat(group: Group) {
    for (let catc of this.dataMangementService.tenantData.categories)
      if (group.categoryId == catc.id)
        return catc;
    return null;
  }
}
