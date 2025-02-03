import { HttpClient } from '@angular/common/http';
import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

import * as Highcharts from 'highcharts';
import {
  interval,
  Subscription,
} from 'rxjs';
import { takeWhile } from 'rxjs/operators';

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
  selector: 'ngx-dashboard-rt',
  styleUrls: ['./dashboard-rt.component.scss'],
  templateUrl: './dashboard-rt.component.html',
})
export class DashboardRtComponent implements OnDestroy, OnInit {
  
  alive:boolean = true;
  rate:any;
  rate$:Subscription;
  Highcharts: typeof Highcharts = Highcharts;
  chardata: any[] = [];
  chartOptions: any;
  containerWidth =-1;

  constructor(private http:HttpClient) {
  }

  @ViewChild('refContainer', {read: ViewContainerRef}) 
  container: ViewContainerRef;

  ngDoCheck(): void {
    let currentContainerwidth: number;
    try {
      currentContainerwidth = this.container.element.nativeElement.offsetWidth;
    } catch(e){
      currentContainerwidth = 0;
    }
    let i = 0;
    if (currentContainerwidth != this.containerWidth ) {
      this.containerWidth = currentContainerwidth;
    for( let c of this.Highcharts.charts){
       try{
        if(this.Highcharts.charts[i] != undefined) 
        this.Highcharts.charts[i].reflow();//.setSize(this.containerWidth,this.container.element.nativeElement.height);
       }catch(error){ console.debug(error); }
        i++;
    }
  }
  }

  ngOnInit()
  { const s = interval(2000);
    s.pipe(takeWhile(()=> this.alive))
    .subscribe(data => {
        this.chardata.push(data);
        this.getChart();
      });
  }

  getChart() {
    this.chartOptions = {
        accessibility:{
          enabled: false,
        },
      series: [{
        data: this.chardata,
      }, ],
      chart: {
        type: "line",
        zoomType: 'x',
        accessibility:{
          enabled: false,
        }
      },
      title: {
        text: "linechart",
      }
    };
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
