import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { DateInterval, Group, Installation, ReportDto, Zone } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { ReportService } from '../../../@core/service/report.service';
import { owner } from '../../../global.config';
import { saveAs as importedSaveAs } from 'file-saver';
import { User } from '../../../authenification/credentials';
import { orderByField } from '../../../@core/utils/global/order';
import { delay, takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';


@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  report: ReportDto = new ReportDto();
  download: boolean = false;
  downloadAnnual: boolean = false;
  dateInterval: DateInterval = new DateInterval();

  owner: string;

  // zone 
  zones: Zone[] = [];
  selectedZone: Zone = new Zone();

  // installation
  installations: Installation[] = [];
  selectedInstallation: Installation = new Installation();

  types: string[][] = [['Comparaison', 'COMPARASION'], ['Single installation', 'SINGLEINSTALLATION'], ['Zone', 'BYZONE']];
  issatTypes: string[][] = [['Global', 'ISSAT_GLOBAL'], ['Par compteur', 'ISSAT_GROUP']];

  selectedGroupses: Group;
  alive = true;

  constructor(private dataManagementService: DataManagementService,
    private reportService: ReportService, private toastr: NbToastrService,
    private _router: Router, private datePipe: DatePipe, private sidebarService: NbSidebarService, private layoutService: LayoutService) {

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }

    this.owner = owner;
    try {
      this.dataManagementService.tenantData.zones[0].idZone;
      this.zones = this.dataManagementService.tenantData.zones;
      this.init(dataManagementService.tenantData.zones);
    } catch (error) {

    }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .pipe(delay(50))
      .subscribe(res => {
        this.init(this.dataManagementService.tenantData.zones);
      });
    if (this.isIssat()) this.report.reportDto.type = this.issatTypes[0][1];//'ISSAT_GLOBAL';
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit() {
    this.report.format = 'EXCEL';
    this.report.type = 'energy';
    this.report.reportDto.type = null;
    switch (owner) {
      case 'TRICITY':
      case 'CDC':
      case 'ANME':
      case 'KASSAB':
      case 'KASSAB2':
        this.report.dateInterval.endDate.setHours(23, 59, 59, 0);
        this.report.dateInterval.startDate = new Date(new Date().getFullYear(), 0, 1);
        this.dateInterval.endDate.setHours(23, 59, 59, 0);
        this.dateInterval.startDate = new Date(new Date().getFullYear(), 0, 1);
        break;
      default:
        this.report.dateInterval.endDate.setHours(23, 59, 59, 0);
        this.report.dateInterval.startDate.setTime(this.report.dateInterval.startDate.getTime() - 3 * 86400000);
        this.report.dateInterval.startDate.setHours(0, 0, 0, 0);

        this.dateInterval.endDate.setHours(23, 59, 59, 0);
        this.dateInterval.startDate.setTime(this.report.dateInterval.startDate.getTime() - 3 * 86400000);
        this.dateInterval.startDate.setHours(0, 0, 0, 0);
        break;
    }

  }

  chooseInstallation(installation) {
    this.selectedInstallation = installation;
    this.report.reportDto.idsRange.splice(0);
    this.report.reportDto.idsRange.push(this.selectedInstallation.id);
  }

  chooseZone(zone) {
    this.selectedZone = zone;
    this.report.reportDto.idsRange.splice(0);
    this.report.reportDto.idsRange.push(this.selectedZone.idZone);
  }

  updateTypes(type: string): void {
    this.report.reportDto.type = type;
  }

  onDownoaldingReport() {
    this.download = true;
    this.validateForm();
    if (this.download) {
      this.reportService.getRepport(this.report).subscribe(
        blob => {
          if (blob.size !== 0) {
            if (this.report.format == "EXCEL") {
              importedSaveAs(blob, this.report.type + '.xlsx');
            }
            this.download = false;
          }
          else {
            this.toastr.danger('Pas de données pour cet interval!', 'Erreur');
            this.download = false;
          }

        },
        error => {
          this.toastr.danger(error, 'Erreur');
          this.download = false;
        },
        () => { this.download = false; }
      );
    }
  }

  validateForm() {
    if (this.report.reportDto.type != 'BYZONE') {
      if (this.selectedInstallation.id === undefined) {
        this.toastr.danger('Please select an installation!', 'Error');
        this.download = false;
      }
      else {
        this.report.dateInterval.endDate = new Date(this.report.dateInterval.startDate.getTime());
        this.report.dateInterval.endDate.setHours(23, 0, 0, 0);
        this.report.dateInterval.startDate.setHours(0, 0, 0, 0);
        if (this.report.reportDto.type === 'COMPARASION') {
          this.report.dateInterval.endDate.setDate(this.report.dateInterval.startDate.getDate() + 6);
        }
      }
    }
    if (this.report.reportDto.type === 'BYZONE') {
      if (this.selectedZone.idZone === undefined) {
        this.toastr.danger('Please select a zone!', 'Error');
        this.download = false;
      }
      else if (this.report.dateInterval.startDate > this.report.dateInterval.endDate) {
        this.toastr.danger('Please verify the date range!', 'Error');
        this.download = false;
      }
    }
  }

  init(zones: Zone[]) {
    this.zones = zones;
    let k = 0;
    for (let i = 0; i < zones.length; i++) {
      for (let j = 0; j < zones[i].installations.length; j++) {
        this.installations[k] = zones[i].installations[j];
        k++;
      }
    }
    this.installations = this.orderByName(this.installations);

  }

  onDownoaldingReportVilavi() {
  /*  window.location.href = ('/reporting_without_authentification/' + this.datePipe.transform(this.report.dateInterval.startDate, "dd-MM-yyyy") +
      '/' + this.datePipe.transform(this.report.dateInterval.endDate, "dd-MM-yyyy") + '/days/1');
  */}

  onDownoaldingReportVilaviHours() {
    /*window.location.href = ('/reporting_without_authentification/' + this.datePipe.transform(this.report.dateInterval.startDate, "dd-MM-yyyy HH:mm:ss") +
      '/' + this.datePipe.transform(this.report.dateInterval.endDate, "dd-MM-yyyy HH:mm:ss") + '/hours/1');
  */}

  onDownaldingAnnual() {
    this.downloadAnnual = true;
    if (this.owner == 'TRICITY' || 'ANME' || 'KASSAB' || 'KASSAB2' || 'CDC') {
      this.reportService.getRepportAnnual(this.dateInterval, 'installation').subscribe(
        blob => {
          if (blob.size !== 0) {
            if (this.report.format == "EXCEL") {
              importedSaveAs(blob, this.report.type + '.xlsx');
            }
            this.downloadAnnual = false;
          }
          else {
            this.toastr.danger('No data for that date range!', 'Error');
            this.downloadAnnual = false;
          }
        },
        error => {
          this.toastr.danger(error, 'Error');
          this.downloadAnnual = false;
        },
        () => { this.downloadAnnual = false; }
      );
    }
  }

  onDownaldingAnnualVilavi() {
    this.downloadAnnual = true;
    /* this.reportService.getRepportAnnual(this.dateInterval).subscribe(
       blob => {
         if (blob.size !== 0) {
           if (this.report.format == "EXCEL") {
             importedSaveAs(blob, this.report.type + '.xlsx');
           }
           this.downloadAnnual = false;
         }
         else {
           this.toastr.danger('No data for that date range!', 'Error');
           this.downloadAnnual = false;
         }
       },
       error => {
         this.toastr.danger(error, 'Error');
         this.downloadAnnual = false;
       },
       () => { this.downloadAnnual = false; }
     );*/
  }

  isIssat() {
    try {
      let user: User = JSON.parse(localStorage.getItem('currentUser'));
      let res = user.id == 31 && this.owner == 'ANME';
      return res;
    } catch (error) {
      return false;
    }
  }

  onIssatReport() {
    this.downloadAnnual = true;

    if (this.report.reportDto.type == 'ISSAT_GROUP' && this.selectedGroupses == null)
      this.toastr.warning("Warning", 'Veuillez selectionner un group.');
    else {
      this.report.dateInterval = this.dateInterval;
      this.report.type = "ISSAT_GROUP";
      try {
        this.report.reportDto.idsRange =
          this.report.type == "ISSAT_GROUP" ?
            [this.selectedGroupses.id] : [];
      } catch (error) { }


      this.reportService.getMonthlyRepport(this.report).subscribe(
        blob => {
          if (blob.size !== 0) {
            if (this.report.format == "EXCEL") {
              importedSaveAs(blob, this.report.type + '.xlsx');
            }
            this.downloadAnnual = false;
          }
          else {
            this.toastr.danger('No data for that date range!', 'Error');
            this.downloadAnnual = false;
          }
        },
        error => {
          this.toastr.danger(error, 'Error');
          this.downloadAnnual = false;
        },
        () => { this.downloadAnnual = false; }
      );
    }
  }

  orderByName(array) {
    try {
      return orderByField(array, 'name');
    } catch (error) { }
  }


}
