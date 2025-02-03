import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit {

  //pie
  options: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    this.pieChartMethod();
  }


  pieChartMethod() {


    this.options = {
      backgroundColor: echarts.bg,
      color: ["powderblue", "coral", "lightgray", "moccasin"],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Cheuvauchement des fils', 'Oublier un composant', 'Manque un composant', 'Retard'],
        textStyle: {
          color: echarts.textColor,
        },
      },
      series: [
        {
          name: 'Countries',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: 'Cheuvauchement des fils' },
            { value: 310, name: 'Oublier un composant' },
            { value: 234, name: 'Manque un composant' },
            { value: 135, name: 'Retard' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor,
            },
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
          },
        },
      ],
    };

  }


}
