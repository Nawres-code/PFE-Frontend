import { Component, Input, OnInit } from '@angular/core';
import { FA_ICONS  } from '../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-slide-out',
  templateUrl: './slide-out.component.html',
  styleUrls: ['./slide-out.component.scss']
})
export class SlideOutComponent implements OnInit {
  @Input() showInputs: boolean = false;
  faIcon = FA_ICONS;
  constructor() { }

  ngOnInit() {
  }

  toggleStatistics() {
    this.showInputs = !this.showInputs;
  }

}
