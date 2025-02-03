import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

import { User } from '../../../../authenification/credentials';
import { NbThemeService } from '@nebular/theme';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-zone-cdc',
  templateUrl: './zone-cdc.component.html',
  styleUrls: ['./zone-cdc.component.scss']
})
export class ZoneCdcComponent implements OnInit, AfterViewInit {

  quantityLad: number = 0;
  ppm: number = 0;
  efficience: number = 0;
  numberFaute: number = 0;
  downtime: number = 0;

  idLine: number = 0;
  stations: any[] = [];
  idCount: number = 0;
  imagePath: String = "";

  @ViewChild('lineCanvas') private lineCanvas: ElementRef | any;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef | any;
  lineChart: any;
  doughnutChart: any;

  public currentUser: User = new User();

  constructor(private router: Router, private route: ActivatedRoute) {

    Chart.register(...registerables);
    this.route.queryParams.subscribe(params => {
      this.idLine = 0;//params["idLine"];
      this.idCount = 8;//params["idCount"];
      this.stations = [];
      for (let i = 0; i < this.idCount; i++)
        this.stations.push({});
      this.imagePath = params["imagePath"];
      console.log("idLine=>" + this.idLine);
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }


  ngAfterViewInit() {
    this.lineChartMethod();

    this.doughnutChartMethod();
  }

  isRoleDashborad(): boolean {
    if (this.currentUser.roles.indexOf('ROLE_CONTROL') > -1) {
      return true;
    } else {
      return false;
    }
  }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["DEFAUT", "OK"],
        datasets: [{
          label: '# of Votes',
          data: [7, 50],
          hoverBackgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(0, 0, 192, 0.2)'
          ],
          backgroundColor: [
            '#FF0056',
            '#006384'
          ]
        }]
      }
    });
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [
          {
            label: 'objectif',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [60, 60, 80, 70, 80, 60, 70, 70],
            spanGaps: false,
          },
          {
            label: 'ppm',
            type: 'line',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            spanGaps: false,
          }

        ]
      }
    });
  }

  getImage(i: number) {
    if (i == 5 && this.idLine == 0)
      return '../assets/images/userred.png'

    if (i == 4 && this.idLine == 2)
      return '../assets/images/userred.png'


    if (i == 3 && this.idLine == 3)
      return '../assets/images/userredall.png'


    return '../assets/images/usergreen.png'
  }



  navigateToDetails(id: number) {
    console.log("clicked");
    let navigationExtras: NavigationExtras = {
      queryParams: {
        idLine: id,
        idCount: this.getIdCount(id),
        imagePath: this.getImagePath(id)
      }
    };
    this.router.navigate(['/tabs/tab3/'], navigationExtras);
  }

  getIdCount(id: number): number {
    switch (id) {
      case 0:
        return 7;
      case 1:
        return 3;
      case 2:
        return 5;
      case 3:
        return 4;

    }
    return 0;
  }

  getImagePath(id: number): string {
    return "../assets/images/ligne" + this.getIdCount(id) + ".png";
  }

}
