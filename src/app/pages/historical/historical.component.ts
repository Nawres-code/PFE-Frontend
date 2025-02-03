import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-historical',
  template: ` <router-outlet></router-outlet>`,
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
