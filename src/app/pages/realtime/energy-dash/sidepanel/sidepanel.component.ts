import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Installation } from '../../../../@core/data/data';
import { RtStatisticalDto } from '../../../../@core/data/rtStatisticalDto';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { owner } from '../../../../global.config';

@Component({
  selector: 'sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss']
})
export class SidepanelComponent implements OnDestroy{

  //selectedZOne
  zones: Zone[] = Array();
  owner: string = owner;

  rtStatisticalDto : RtStatisticalDto[] = Array();

  installations : Installation [] = Array();

  selectBy: string = 'zone';

  type: string = 'thisday';

  types: string[][] = [/*['Last Hour','lasthour'],*/ ["Last Day",'lastday'], ["This day",'thisday' ]];

  choix : string[][] = [ ['Zone','zone'], ['Magasin','installation']];

  @Output() periodChange = new EventEmitter<string>();

  @Output() choixChange = new EventEmitter<string>();

  @Input() zoneIds: number[] = [];

  @Input() installationIds: number[] = [];

  alive: boolean = true;

  loading: boolean = false;

  constructor(public dataManagementService: DataManagementService, private _router: Router) {
    this.choix = this.owner == 'AZIZA' 
    ? [ ['Zone','zone'], ['Magasin','installation']] 
    : [ ['Zone','zone'], ['Installation','installation']] ; 
    this.initByUrl(_router.url);
    this._router.events
      .pipe(takeWhile(()=>this.alive))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.initByUrl(event.url);
        }
      });
  }
 
  initByUrl(url){
    let urlSections = url.split('/');
    try {
      switch(urlSections[urlSections.length-1]){
        case 'zone':
          this.choix = this.owner == 'AZIZA' ?
           [ ['Zone','zone'], ['Magasin','installation']] 
           : [ ['Zone','zone'], ['Installation','installation']];
          this.zoneIds= [this.dataManagementService.selectedZone.idZone]; this.installationIds = this.dataManagementService.selectedZone.installations.map(i=> i.id);
          this.selectBy = 'installation';
          break;
        case 'installation':
          this.choix = this.owner == 'AZIZA' 
          ? [ ['Magasin','installation']] 
          : [['Installation','installation']];
          this.zoneIds= []; this.installationIds = [this.dataManagementService.selectedInstallation.id];
          this.selectBy = 'installation';
          break;
        default:
        this.choix = this.owner == 'AZIZA' ?
         [ ['Zone','zone'], ['Magasin','installation']]
         : [ ['Zone','zone'], ['Installation','installation']];
        this.zoneIds= []; this.installationIds = [];
        this.selectBy = 'zone';
        this.type ='thisday';
        break;
      }
    } catch (error) { }    

    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init();
    } catch (error) {
      this.dataManagementService.GroupsLoaded$.pipe(
        takeWhile(()=>this.alive)
      ).subscribe(resp => {
        this.init();
      });
    }
  
  }

  init(){
    timer(0, 60000) // every 1 minute
    .pipe(takeWhile(()=>this.alive))
    .subscribe(val => this.getAllRtStatistical());
  }

  update(chose : string): void {
    this.loading = true;
    this.selectBy = chose;
    this.choixChange.emit(chose);
    this.getAllRtStatistical();
  }

  changePeriod(period: string): void {
    this.loading = true;
    this.type = period;
    this.periodChange.emit(period);
    this.getAllRtStatistical();
  }

  getAllRtStatistical() {
    this.dataManagementService.getAllRtStatistical(this.selectBy,this.type)
    .subscribe(res => {
      let tmp: RtStatisticalDto[] = [];
      Object.keys(res).forEach(key => {
        tmp.push(new RtStatisticalDto(Number.parseInt(key),res[key]['val1'],res[key]['val2']));
      });
      tmp.sort((n1,n2) => {
        return this.getVariationPct(n2)>this.getVariationPct(n1)?1:-1;
      });
      this.dataManagementService.rtStatisticalDto = tmp;
      this.loading = false;
    });
  }

  getVariationPct(rt: RtStatisticalDto){
    if(rt)
      return (rt.val1-rt.val2) / rt.val1 * 100;
    else 
      return 0;
  }

  filterByZoneIds() {
    if(this.zoneIds.length >0 ){
      return this.dataManagementService.rtStatisticalDto.filter(stat=> this.zoneIds.indexOf(stat.id)> -1);
    }
    return this.dataManagementService.rtStatisticalDto;
  }

  filterByInstallationIds() {
    if(this.installationIds.length >0 ){
      return this.dataManagementService.rtStatisticalDto.filter(stat=> this.installationIds.indexOf(stat.id)> -1);
    }
    return this.dataManagementService.rtStatisticalDto;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
