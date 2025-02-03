import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/utils/smart-table';
import { SondeService } from '../../../@core/service/sonde.service';
import { SondeData, TenantData, Installation } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { User } from '../../../authenification/credentials';
import { owner } from '../../../../app/global.config';
import { take, takeWhile } from 'rxjs/operators';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { ConfigurationDropListComponent, ConfigurationDropListEditComponent, DropListComponent, DropListEditComponent } from '../../../@core/utils/smartTable/drop-list/drop-list.component';
import { LayoutService } from '../../../@core/utils';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../@core/service/my-translate.service';

@Component({
  selector: 'ngx-sonde',
  templateUrl: './sonde.component.html',
  styleUrls: ['./sonde.component.scss']
})

export class SondeComponent implements OnDestroy, OnInit {

  loading: Boolean;
  // seclect installation
  installations: Installation[] = Array();
  public currentUser: User = new User();
  // @ViewChild("confirmDeleteModal") confirmDeleteModal: ModalDirective;
  owner: string;
  settings: any = null;

  loadSettings(){
    this.translateService.get(['INSTALLATION.ref','INSTALLATION.mac',
    'INSTALLATION.sondeName','INSTALLATION.conf', 'INSTALLATION.threshMin',
    'INSTALLATION.threshMax', 'INSTALLATION.depot', 'INSTALLATION.chamber',
    'INSTALLATION.installation'])
    .pipe(takeWhile(() => this.alive))
    .subscribe(resp => {
      this.settings = {
        actions: {
          add: false,
          delete: false,
          columnTitle: '', // minimize the actions column size
        },
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmCreate: true,
        },
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true,
        },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          id: {
            title: resp['INSTALLATION.ref'],//'Référence',
            type: 'string',
            filter: true,
            editable: false,
            addable: false
          },
          fictifId: {
            title: resp['INSTALLATION.mac'], //Mac',
            type: 'string',
            editable: true,
            filter: true
          },
          name: {
            title: resp['INSTALLATION.sondeName'],//"Nom de sonde ",
            type: 'string',
            editable: true,
            filter: true
          },
          configuration:{
            title: resp['INSTALLATION.conf'], //"Configuration",
            type: 'custom',
            filter: true,
            renderComponent: ConfigurationDropListComponent,
            onComponentInitFunction: (instance) => {
              instance.list = ['temperature', 'temperature;humidity','temperature;humidity;battery', ];
              instance.placeholder = resp['INSTALLATION.conf'];//'Configuration';
            },
            editor: {
              type: 'custom',
              component: ConfigurationDropListEditComponent,
            }
          },
          minThreshold: {
            title: resp['INSTALLATION.threshMin'], //'Temperature min',
            type: 'number',
            filter: false
          },
          maxThreshold: {
            title: resp['INSTALLATION.threshMax'],//'Temperature max',
            type: 'number',
            filter: false
          },
          installationName: {
            title: resp['INSTALLATION.'+this.getInstallationTitle()],
            type: 'custom',
            filter: true,
            valuePrepareFunction: (value, row, cell) => {
               // DATA FROM HERE GOES TO renderComponent
               return value.toUpperCase();
             },
            renderComponent: DropListComponent,
            onComponentInitFunction: (instance) => {
              instance.list = this.installations.map(i => i.name.toUpperCase()).sort();
              instance.placeholder = resp['INSTALLATION.'+this.getInstallationTitle()];
            },
            editor: {
              type: 'custom',
              component: DropListEditComponent,
            }
          },
        },
      };
    });
      
   }

  source: LocalDataSource = new LocalDataSource();
  private alive: boolean = true;

  constructor( private sondeService: SondeService, private toastr: NbToastrService,
    private dataManagementService: DataManagementService,
    private sidebarService:NbSidebarService,
     private layoutService:LayoutService, private translateService:TranslateService, private myTranslateService: MyTranslateService) { 
      
      this.loadSettings(); 
      this.myTranslateService.translate$
      .pipe(takeWhile(() => this.alive))
      .subscribe(()=> {this.loadSettings();});

      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }


  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init(this.dataManagementService.tenantData);
    }catch(error){ } 
    
      this.dataManagementService.GroupsLoaded$
        .pipe(takeWhile(() => this.alive))
        .subscribe(tenantData => {
          this.init(tenantData);
        });
    this.owner = owner;
  }

  ngOnDestroy(): void { this.alive = false }

  init(tenantData: TenantData) {
    this.installations = tenantData.zones.flatMap(z => z.installations);
    this.loadAllSonde();
  }

  loadAllSonde() {
    this.loading = true;
    this.sondeService.sondes = [];
    this.sondeService.findAll(+localStorage.getItem("id")).subscribe(sonde => {
      sonde.forEach(snd => {
        if (this.dataManagementService.userHasInstallation(snd.installationId)) {
          //if (this.dataManagementService.userHasSondeAuthority(snd.role)) {
          this.sondeService.sondes.push(snd);
          //}
        }
      });
      this.source.load(this.sondeService.sondes);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.sondeService.deleteSonde(event.data.id).subscribe(
        (data)=> { 
          event.confirm.resolve(); 
      });
    } else { event.confirm.reject(); }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit?')) {
      var data = {
        "type": event.newData.type,
        "installationId": this.installations.filter(i=>i.name.toUpperCase() == event.newData.installationName)[0].id,
        "installationName": event.newData.installationName,
        "indexHumDevice": event.newData.indexHumDevice,
        "minThreshold": event.newData.minThreshold,
        "maxThreshold": event.newData.maxThreshold,
        "name": event.newData.name,
        "id": event.newData.id,
        "configuration": event.newData.configuration,
        "fictifId":event.newData.fictifId,
      };
      this.sondeService.updateSonde(data).subscribe(
        res => {
          res.installationName = data.installationName;
          event.confirm.resolve(res);
          this.dataManagementService.getAllZoneByTennatId(+localStorage.getItem("id"))
          .pipe(take(1))
          .subscribe(res => this.dataManagementService.tenantData.zones = res);
        }
      );
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event){
    // console.log("On create");
    var data = {
      "type": event.newData.type,
      "installationId": this.installations.filter(i=>i.name.toUpperCase() == event.newData.installationName)[0].id,
      "installationName": event.newData.installationName,
      "indexHumDevice": event.newData.indexHumDevice,
      "minThreshold": event.newData.minThreshold,
      "maxThreshold": event.newData.maxThreshold,
      "name": event.newData.name,
      "id": null,
      "configuration": event.newData.configuration,
      "fictifId":event.newData.fictifId,
    };
    this.sondeService.addSonde(data).subscribe(
      res => {
        data.id = res.id;
        event.confirm.resolve(data);
      }
    );
  }

   getInstallationTitle(){
    switch (owner){
      case "DEPOT":
      case "FLEETDEPOT":
        return "depot";
      case "MEKATECH":
        return "chamber";
      default:
        return "installation";
    }
    
   }
}
