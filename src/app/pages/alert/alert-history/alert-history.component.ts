import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { delay, takeWhile } from 'rxjs/operators';
import { ArchiveAlertDto } from '../../../@core/data/data';
import { Operator } from '../../../@core/data/enum';
import { AlertsService } from '../../../@core/service/alerts.service';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { LayoutService } from '../../../@core/utils';
import { User } from '../../../authenification/credentials';

@Component({
  selector: 'ngx-alert-history',
  templateUrl: './alert-history.component.html',
  styleUrls: ['./alert-history.component.scss']
})
export class AlertHistoryComponent implements OnInit, OnDestroy {
  owner: string;
  loading: Boolean;
  currentUser: User = null;
  settings = null;

 loadSettings(){
  this.translateService.get([...[,'ALERT.mesureTitle','ALERT.typeTitle',
  'ALERT.conditionTitle','ALERT.valueTitle']])
  .pipe(takeWhile(() => this.alive))
  .subscribe(resp => {
    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        columnTitle: '', // minimize the actions column size
        position: 'right',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        time: {
          title: resp['ALERT.dateTitle'],
          type: Date,
          filter: true,
          valuePrepareFunction: (value, row, cell) => {
            // DATA FROM HERE GOES TO renderComponent
            return formatDate(value, 'yyyy-MM-dd hh:mm', 'en_US');
          },
        },
        measureLbl:{
          title: resp['ALERT.mesureTitle'], 
          type: String,
          filter: true,
        },
        alertLbl: {
          title: resp['ALERT.typeTitle'], 
          type: String,
          filter: true,
        },
        condition:{
          title: resp['ALERT.conditionTitle'], 
          type: String,
          filter: true,
        },  
        calVal: {
          title: resp['ALERT.valueTitle'],
          type: String,
          filter: true,
        },
      },
    };
  });
    
 }

  source: LocalDataSource = new LocalDataSource();
  private alive: boolean = true;
  constructor(private alertService: AlertsService, private dataService: DataManagementService,
     private sidebarService:NbSidebarService, private layoutService:LayoutService,
      private translateService: TranslateService, private myTranslateService: MyTranslateService) { 
        this.loadSettings();
          this.myTranslateService.translate$.subscribe(resp => this.loadSettings());

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }

   }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
      this.dataService.tenantData.zones[0].name;
      this.init();
    } catch (error) {
      //this.dataService.init();
    }

    this.dataService.GroupsLoaded$
      .pipe(takeWhile(()=> this.alive))
      .pipe(delay(50))
      .subscribe(res=>{
        this.init();
      });
    
  }

  ngOnDestroy(): void {
  }

  init(){
      this.alertService.getAllArchive(this.currentUser.id)
      .subscribe(
        res => { 
          res.forEach(item=> {
            item['condition'] = item.infractedVal == null ? '--' : this.getCondition(item);
            item['measureLbl'] = this.getMeaserLbl(item);
            item['alertLbl'] = this.alertService.getAlertLabel(item.alertType, item.measureType);
            item['calVal'] = item.calcVal == null? '--':item.calcVal.toFixed(2)+' '+this.alertService.getUnit(item.alertType);
          })
          this.source.load(res);
        });
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      /*this.sondeService.deleteSonde(event.data.id).subscribe(
        (data)=> { 
          event.confirm.resolve(); 
      });*/
    } else { event.confirm.reject(); }
  }

  getMeaserLbl(archive: ArchiveAlertDto): String {
    let resultLbl = '';
    let zone = this.dataService.tenantData.zones.find(z=> z.idZone ==+archive.zoneId);
    let installation = zone.installations.find(i => i.id ==+archive.installationId);
    let measureLbl;
    switch (archive.measureType) {
      case 'GROUP':
        measureLbl = installation.groupses.find(g => g.id == +archive.measureId).name;
        break;
      case 'PHASE':
        measureLbl = installation.groupses.flatMap(g => g.phases)
        .find(p => p.id == +archive.measureId).name;
        break;
        case 'SONDE':
        measureLbl = installation.sondes
        .find(p => p.id == +archive.measureId).name;
        break;
       default:
        measureLbl = archive.measureType.startsWith('IO_')? installation.ioList
        .find(p => p.id == +archive.measureId).name: '';

      //   lbl = `${zone.name} - ${installation.name}
      //   ${archive.measureId}`
         break;
    }
    if(this.dataService.tenantData.zones.length<2){
      zone = null;
    }

    resultLbl = `${zone?zone.name+' -':''} ${installation.name}, ${measureLbl}`

    return resultLbl;
  }

  /*getInputCatName() {
    try {
      if (this.alert.measureType == 'INPUT')
        return this.dataService.tenantData.zones[0].installations[0].inputs
          .find(inp => inp.id == +this.alert.measureId).category.name +' - ';
    } catch (e) { return ''; }
    return '';
  }*/
  getCondition(archive: ArchiveAlertDto){
    let strValueConfig: string; 
    let value1 = archive.infractedVal.split(';')[0];
    let value2 = archive.infractedVal.split(';')[1];
    let unit: string = this.alertService.getUnit(archive.alertType);

    strValueConfig = `${Object.keys(Operator).filter(e => Operator[e] == archive.infractedOperator)[0]}`;
    if (value1 != null) {
      strValueConfig += ` ${value1} ${unit}`;
      if (value2 != null) {
        strValueConfig += ` and`;
      }
    }
    if (value2 != null) {
      strValueConfig += ` ${value2} ${unit}`;
    }
    // if(this.alert.pendingPeriod != 0 && this.alert.pendingPeriod != undefined) {
    //   strValueConfig +=  ` pour ${this.alert.pendingPeriod} minutes`;
    // }
    return strValueConfig;
  }
}
