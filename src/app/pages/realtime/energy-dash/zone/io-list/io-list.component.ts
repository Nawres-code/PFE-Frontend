import { Component, Input, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IOImpulse } from '../../../../../@core/data/data';
import { DataManagementService } from '../../../../../@core/service/data-management.service';
import { orderByField } from '../../../../../@core/utils/global/order';

@Component({
  selector: 'ngx-io-list',
  templateUrl: './io-list.component.html',
  styleUrls: ['./io-list.component.scss']
})
export class IoListComponent implements OnDestroy {

  private alive = true;
  periods = [{label:'lastHour', val:'hour'}, {label:'currentDay', val:'day'},
   {label:'currentWeek', val:'week'}, {label:'currentMonth', val:'month'}];
  period =  this.periods[1];
  ioList: IOImpulse[] = [];
  rtList: Map<number, any> = new Map();
  @Input() type: string;

  constructor(private dataManagement: DataManagementService) {
    this.dataManagement.GroupsLoaded$
        .pipe(takeWhile(() => this.alive))
        .subscribe(tenantData => {
          this.getUserActivity(this.period['val']);
        });
    timer(0, 20000) // every 1 minute
    .pipe(takeWhile(()=>this.alive))
    .subscribe(val => this.getUserActivity(this.period['val']));
  }

  getUserActivity(p: string) {
    try {
      this.ioList = this.dataManagement.selectedZone.installations
      .flatMap(inst => inst.ioList).filter(ioItem => ioItem.type == this.type );
      this.dataManagement.getAllRtIo(p)
      .subscribe( resp => { this.rtList = resp; });
    } catch (error) { }
  }

  getRtValue(itemId) {
    try {
      return  Math.round((this.rtList[itemId].value) * 100) / 100;
    } catch (error) { }
    return '--';
  }

  ngOnDestroy() {
    this.alive = false;
  }

  orderByName(array:any[]){
    return orderByField(array, 'name');
  }
}
