import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { NbToastrService } from '@nebular/theme';
import { Group } from '../../../../@core/data/data';
import { GraphService } from '../../../../@core/service/graph.service';
import { take, takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { Unit } from '../../../../@core/data/comaparator';
import { LayoutService } from '../../../../@core/utils';
@Component({
    selector: 'app-energy-graph',
    templateUrl: './energy-graph.component.html',
    styleUrls: ['./energy-graph.component.css']
})
export class EnergyGraphComponent implements OnInit, OnDestroy {
    //select group
    @Input()
    groupIds: number[] = new Array();
    @Input()
    groups: Group[] = new Array();
    //date
    @Input()
    startDate: Date = new Date();
    @Input()
    endDate: Date = new Date();
    @Input()
    period: String = "";

    @Input()
    refreshNow: Date;
     
    @Input('type')
    wtype: string;

    loading: boolean = false;


    _lastUpdate: Date

    @Input('lastUpdate')
    set lastUpdate(lastUpdate: Date) {
        this._lastUpdate = lastUpdate;
        if(this._lastUpdate)
          this.refresh();
    }
    @Output()
    onData: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive: boolean = true;
    chartOptions: any;
    Highcharts: typeof Highcharts = Highcharts;
    chart: Highcharts.Chart;
    chartData;

    chartRef;

    constructor( public toastr: NbToastrService, 
        private layoutService: LayoutService,
        private graphService: GraphService,
        private dataManagementService: DataManagementService) {
        this.onData.emit(false);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    ngOnInit() {
        this.layoutService.onChangeLayoutSize()
        .pipe(takeWhile(()=> this.alive))
        .subscribe(resp=> {
          try {
            for( let c of this.Highcharts.charts){ 
              try{
                if(c != undefined) 
                this.chartRef.reflow();
                    //c.reflow();//.setSize(this.containerWidth,this.container.element.nativeElement.height);
                }catch(error){}
            }
          } catch (error) { }
            // this.chart.setSize(this.container.element.nativeElement.offsetWidth,
            //   this.container.element.nativeElement.offsetHeight, true);
        });
    }


      async getChart() {
         this.chartOptions = {
        time: {
            timezoneOffset: new Date().getTimezoneOffset(),
        },
        accessibility:{
        enabled: false,
        },
        chart: {
            // backgroundColor: 'rgba(0,0,0,0)',
            type: 'column',
            // height: 630,
            zoomType: 'x'
        },
        title: {
            text: 'Energy Graph',
            style: {
                display: 'none'
            }
        },
        xAxis: {
            type: "datetime"
        },
        yAxis: [{ // left y axis 
            title: {
                text: null
            },
            labels: {
                align: 'left',
                x: 3,
                y: 16,
                format: '{value}'+Unit.Kwh
            },
            showFirstLabel: false
        }],
        series: this.chartData,
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
    }
}

    refresh() {
        let installationName = '';
        try {
            // installationName = this.dataManagementService.selectedInstallation.name;
          } catch (error) { }
        this.loading = true;
        this.wtype = this.wtype== undefined? 'energy_act': this.wtype;
            this.graphService
            .loadSeries('ENERGY',  this.startDate, this.endDate,this.groups, this.groupIds,this.period, this.wtype, null,null,null,null,installationName)
            .pipe(take(1))
            .subscribe({
                next:(series) => {
                    if (series.length == 0) {
                      this.loading = false;
                      this.toastr.warning("Pas de données à afficher");
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
                    /*  this.chartData = series;
                            this.getChart();      */
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
                complete: () => { this.loading = false;}
            });
    }
    chartCallback: Highcharts.ChartCallbackFunction = chart => {
      this.chartRef = chart;
    };
    
}

