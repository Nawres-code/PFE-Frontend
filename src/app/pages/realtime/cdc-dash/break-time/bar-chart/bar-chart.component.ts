import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  options: any = {};
  constructor() { }

  ngOnInit(): void {
    this.barChartMethod();
  }


  barChartMethod() {
    this.options = {
      backgroundColor: echarts.bg,
      color: ["lightcoral", "powderblue" , "powderblue"],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['1', '2', '3'],
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: echarts.splitLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      series: [
        {
          name: 'Score',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200],
        },
      ],
    };
  }
}
