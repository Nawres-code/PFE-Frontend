import { Component, OnInit } from '@angular/core';
import { Installation, Sonde, Group, Point, Sensor } from '../../../../@core/data/data';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { owner } from "../../../../global.config";
import { GraphService } from '../../../../@core/service/graph.service';
import { NbDateTimePickerComponent, NbDialogRef, NbToastrService } from '@nebular/theme';
import { GraphEntry } from '../../../../@core/data/comaparator';
import { FormControl } from '@angular/forms';
import { myConstants } from './form-comparator.const';
import { orderByField } from '../../../../@core/utils/global/order';
@Component({
  selector: 'ngx-form-comparator',
  templateUrl: './form-comparator.component.html',
  styleUrls: ['./form-comparator.component.scss']
})
export class FormComparatorComponent {

  // installations list
  installations: Installation[] = Array();
  // periode list
  periods = ['5min', 'Hours', 'Day', 'Month']; 
  // selected installation
  selectedInstallation: Installation;
  selectedSensors: Sensor[] = [];
  graphEntry: GraphEntry;
  ///owner
  owner: string;

  formControl  ;
  formControl1 ;
  render = myConstants;
  constructor(public dataManagementService: DataManagementService, public graphService: GraphService, private ref: NbDialogRef<any>, private toastr: NbToastrService) {
    this.owner = owner;
    this.graphEntry = new GraphEntry();
    this.graphEntry.period = 'Hours';

    if(owner == 'MEKATECH')
      this.periods = ['1min', ...this.periods];

         //date
     this.formControl = new FormControl(this.graphService.startDate);
     this.formControl1 = new FormControl(this.graphService.endDate);
      // Fix NbDateTimePickerComponent for @nebular/theme 9.0.0
    NbDateTimePickerComponent.prototype.ngOnInit = function () {
      this.format = this.format || this.buildTimeFormat();
      this.init$.next();
    };

    switch (owner) {
      case 'METOS':
        this.dataManagementService.selectedZone = this.dataManagementService.selectedZone? this.dataManagementService.selectedZone : this.dataManagementService.tenantData.zones[0];
        this.selectedInstallation = this.dataManagementService.selectedZone.installations[0];
        this.graphEntry.installationName = this.selectedInstallation.name;
        break;
    }
    
  }

  chooseInstallation(installation) {
    this.graphEntry.installationName = installation.name;
    this.graphEntry.groupses = new Array();
    this.dataManagementService.selectedInstallation = installation;
    this.graphEntry.vars = '';
  }

  chooseGroup(group) {
    this.graphEntry.groupses = group;
  }

  chooseSensors(sensors){
    this.graphEntry.sensorIds = sensors.map(sensor=> sensor.id);
  }

  onSubmit() {
    let validate = this.formValidation();
    if(this.owner != 'METOS') {
      //deal with the repeated groups (same vars && installation) => remove them from the entry
      if(this.graphService.graphEntries.length!=0 && validate){
        let groupIds:any[]= this.graphService.graphEntries.filter(e=> e.vars===this.graphEntry.vars && e.installationName === this.graphEntry.installationName)
                                      .flatMap(e=>e.groupses)
                                      .map(e=>e.id);
          for(let i=0 ; i<this.graphEntry.groupses.length; ){
            if(groupIds.indexOf(this.graphEntry.groupses[i].id)>-1){
              this.graphEntry.groupses.splice(i,1);
            }
            else{
              i++;
            }
          }
          if(this.graphEntry.groupses.length===0) {
            this.toastr.danger('Existe déja!', 'Error');
            validate= false;
            this.ref.close();
          }
      }
     }

    if (validate) {
     
      this.graphService.addGraphSerie(this.graphEntry, this.graphService.startDate, this.graphService.endDate);
      this.ref.close();
    }
  }

  chooseZone(zone) {
    this.dataManagementService.selectedZone = zone;
  }

  isSonde(val: String): Boolean {
    if (val == "temperature" || val == "humidity")
      return true;
    return false;
  }

  getMesureContainer(val: string): any[] {
    if (this.selectedInstallation) {
      if (val == "temperature" || val == "humidity") {
        return  this.orderByName(this.selectedInstallation.sondes.filter(s=> s.configuration.indexOf(val)>-1));
      } else if (val == "point") {
        return orderByField(this.selectedInstallation.points, 'label');
      }  else if(val.startsWith('IO_')){
        return this.orderByName(this.selectedInstallation
          .ioList.filter(el => el.type == val.replace('IO_','')));
      }
      return this.orderByName(this.selectedInstallation.groupses);
    }
    return null;
  }

  private formValidation(): boolean {
    let validate = true;
    if (this.graphService.startDate > this.graphService.endDate) {
      this.toastr.danger('Veuillez verifier l\'interval du temps!', 'Error');
      validate = false;
    }
    if(this.owner != 'METOS') {
      if (this.graphEntry.installationName === '') {
        this.toastr.danger('Veuillez selectionner un depot!', 'Error');
        validate = false;
      }
      if (this.graphEntry.vars === '') {
        this.toastr.danger('Veuillez selectionner le type!', 'Error');
        validate = false;
      }
      if (this.graphEntry.period === '' && this.graphEntry.vars==='energy') {
        this.toastr.danger('Veuillez selectionner une periode!', 'Error');
        validate = false;
      }
      if (this.graphEntry.groupses.length === 0) {
        this.toastr.danger('Veuillez selectionner des mesures!', 'Error');
        validate = false;
      }
    } else if (this.owner == 'METOS'){
      if (this.graphEntry.stationId === '') {
        this.toastr.danger('Veuillez selectionner une station!', 'Error');
        validate = false;
      }
      if (this.graphEntry.sensorIds.length === 0) {
        this.toastr.danger('Veuillez selectionner des sensors!', 'Error');
        validate = false;
      }
    }
    return validate;
  }

  onClose(){
    this.ref.close();
  }

  onStartDateChanged(event){
   // console.log('start changed');
    this.graphService.startDate = event;     
    this.graphService.dateRangeChanged$.emit([this.graphService.startDate, this.graphService.endDate]);
  }

  onEndDateChanged(event){
    // console.log('end changed');
    this.graphService.endDate = event;     
    this.graphService.dateRangeChanged$.emit([this.graphService.startDate, this.graphService.endDate]);
  }
  
  getSubGeneral(groups: any[]) {
    let ret: Group[] = [];
    if (groups)
      for (let group of groups) {
        if (group.type != "General")
          ret.push(group);
      }
    return ret;
  }

  orderByName(array: any[]){
    return orderByField(array,'name');
  }

  getAllIoTypes (installation): Set<string> {
    try {
      let typeArr: string[] = [];
      typeArr = installation.ioList.map(item => item.type).sort();
      return new Set(typeArr);
    } catch (error) {
    }
  }
}
