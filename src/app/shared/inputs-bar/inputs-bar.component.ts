import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Inputs } from '../../@core/data/data';
import { DataManagementService } from '../../@core/service/data-management.service';
import {orderByField} from '../../@core/utils/global/order';
import { FA_ICONS } from '../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-inputs-bar',
  templateUrl: './inputs-bar.component.html',
  styleUrls: ['./inputs-bar.component.scss']
})
export class InputsBarComponent implements OnInit {
 
  @Input() inputs: Inputs[] = [];
  @Input() installationId: number = -1;
   
  @Output()
  onInputsChanged: EventEmitter<{status:boolean, name:string}> = new EventEmitter();
  
  faIcon = FA_ICONS;
  
  constructor(public dataManagementService: DataManagementService) { 

  }

  select = {heat:false, fan: false, cool: false, door: true}; 
  

  ngOnInit() {
    try {
      let inputCache: number[];
      inputCache = localStorage.getItem('rtInput').split(',').map(i=>+i);
      this.inputs.forEach(inpt => {
        if(inpt.name=='door' && this.dataManagementService.isInptCacheEmpty) {
          localStorage.setItem('rtInput', localStorage.getItem('rtInput').replace(' '+inpt.id+',',''));
          localStorage.setItem('rtInput', localStorage.getItem('rtInput')+' '+inpt.id+',');
          if(inputCache.indexOf(inpt.id) < 0)
              inputCache.push(inpt.id)
        }
        this.select[inpt.name] = inputCache.indexOf(inpt.id) > -1;
        this.onInputsChanged.emit({status: this.select[inpt.name], name: inpt.name});
      });
    }catch(e) { }
  }

  onToggleSelected(inputName:string, inputId: number) {
    try {
      this.select[inputName] = !this.select[inputName];
      this.onInputsChanged.emit({status: this.select[inputName], name: inputName});
      if(this.select[inputName]) {
        localStorage.setItem('rtInput', localStorage.getItem('rtInput')+' '+inputId+',');
      } else {
        localStorage.setItem('rtInput', localStorage.getItem('rtInput').replace(' '+inputId+',',''));
      }
    } catch(e) {}
  }

  noRender(inputName:string): boolean {
  try {
    return this.inputs.find(i=>i.name==inputName) == undefined;
  }catch(e){ return true;}
  }


  getIdInput(inputName:string): number {
    try{
      return this.inputs.find(i=>i.name==inputName).id;
    }catch(e){
      return -1;
    }
  }

  isDoorState(installationId, inputId, state){
    try {
      return this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.selectedZone.idZone].installationsRtDto[installationId].inputsRtDto[inputId].lastValue == state
    } catch (error) {
      return true;
    }
  }

  orderInputsByName(){
    return orderByField(this.inputs, 'name');
  }
}
