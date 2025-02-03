import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { AlertConfigType, AlertType, Operator } from '../../../@core/data/enum';
import { TimeLimit } from '../../../@core/data/TimeLimit.enum';
import { AlertConfiguration, CronPayload, Alert, SondeData } from '../../../@core/data/data';
import { DatePipe } from '@angular/common';
import { owner } from '../../../global.config';
import { AlertsService } from '../../../@core/service/alerts.service';
import { SondeService } from '../../../@core/service/sonde.service';
import { Subject } from 'rxjs';
import { myConstants } from './alert-form.const';
import { FA_ICONS } from '../../../@core/utils/global/fa-icons';
@Component({
  selector: 'ngx-alert-form',
  templateUrl: './alert-form.component.html',
  styleUrls: ['./alert-form.component.scss']
})
export class AlertFormComponent implements OnInit, OnDestroy {
  @Input() alert: Alert = new Alert();
  @Input() measureIds = [];
  @Input() stationIds = [];
  @Input() cron: CronPayload = new CronPayload();
  render = myConstants;
  // value
 // @Input() showValue: boolean = false;
  @Input() placeholderValue1: string = '';
  @Input() placeholderValue2: string = '';
  @Input() disableValue1: boolean = false;
  @Input() disableValue2: boolean = false;
  // value constraints
  @Input() maxValue: number;
  @Input() minValue: number;
  @Input() valueStep: number;

  // cron
  @Input() hideDateRange: boolean = false;
  @Input() hideCustomTime: boolean = false;
  @Input() hideWeekDays: boolean = false;
  @Input() showTimeLimits: boolean = false;

  valueConfig: AlertConfiguration =  new AlertConfiguration();
  showValue1: boolean = false;
  showValue2: boolean = false;
  customOn: boolean = false;
  owner: String;
  validate: boolean = false;

  destroy$: Subject<boolean> = new Subject<boolean>();
  
  faIcon = FA_ICONS;
  constructor(private ref: NbDialogRef<any>, private datePipe: DatePipe, private toastr: NbToastrService,
     private alertService: AlertsService, private sondeService: SondeService) {
  }

  ngOnInit() {
    this.owner = owner;
    this.valueConfig = this.alert.configs.filter(e => e.type != AlertConfigType.WEEK_DAYS
                                            && e.type != AlertConfigType.DATE 
                                            && e.type != AlertConfigType.TIME)[0];
      try {
        this.onOperatorChange(this.valueConfig.operator != undefined?this.valueConfig.operator: Operator.NONE);        
      } catch (error) { }
    // some custom init 
      this.customInit();

    //create
    if(this.alert.id <= 0) {
    } else { //update
      // this.valueConfig = this.alert.configs.filter(e => e.type != AlertConfigType.WEEK_DAYS && e.type != AlertConfigType.DATE && e.type != AlertConfigType.TIME)[0];
    }

    if(this.owner == 'ANME' || this.owner.includes('KASSAB')) {
      this.showAdvancedSettings = true;
    }
  }

  onCancel() {
    this.ref.close();
  }

  onSubmit() {
    if(this.emailInput != undefined) {
      this.onAddEmail();
    }
    if(this.smsInput != undefined) {
      this.onAddSms();
    }
    this.validate = this.validateForm();
    if (this.validate) {
      this.alert.configs = [];
    
      let configs_temp: AlertConfiguration[] = [this.loadValueConfig(), this.loadTimeConfig(), this.loadDateConfig(), this.loadWeekDaysConfig()];
      configs_temp.filter(e => e != null).forEach(e => this.alert.configs.push(e));
    
      
      // create
      if (this.alert.id <= 0) {
        for (let i = 0; i < this.measureIds.length;) {
            this.alert.measureId = this.measureIds[i];
            switch(owner) {
              case 'METOS': 
                for(let j=0; j < this.stationIds.length ; ) {
                  this.alert.fatherId = this.stationIds[j];
                  this.alertService.createAlert(this.alert).subscribe(
                    (resp) => { this.alertService.emitAlerts(); this.ref.close() },
                    (error) => { this.toastr.danger('Un probléme est survenu!', 'Error'); this.validate = false; }
                  );
                  j++;
                }
              break;
            default: this.alertService.createAlert(this.alert).subscribe(
                (resp) => { this.alertService.emitAlerts(); this.ref.close() },
                (error) => { this.toastr.danger('Un probléme est survenu!', 'Error'); this.validate = false; }
              );
              break;
            }
            i++; 
        };
      } else {  // update
        this.alertService.updateAlert(this.alert.id, this.alert).subscribe(
          (resp) => { this.alertService.emitAlerts(); this.ref.close(); },
          (error) => { this.toastr.danger('Un probléme est survenu!', 'Error'); this.validate = false; }
        );
      }
    }
  }

  onResetValue() {
      if (!this.disableValue1 && this.valueConfig != undefined) {
        this.valueConfig.value1 = null;
      }
      if (!this.disableValue2 && this.valueConfig != undefined) {
        this.valueConfig.value2 = null;
      }
  }

  onResetEmail() {
    this.alert.email = '';
  }

  onResetSms() {
    this.alert.sms = '';
  }

  onResetMsg(){
    this.alert.message = '';
  }

  onResetPeriod(){
    this.alert.pendingPeriod = 0;
  }
  onResetOperator(){
    this.valueConfig.operator = this.getDefaultOperator(this.alert.type);
    this.onOperatorChange(this.valueConfig.operator);
  }

  private loadValueConfig(): AlertConfiguration {
    let config: AlertConfiguration = null;
    if (this.showValue1) {
      config = new AlertConfiguration();
      config.type = this.valueConfig.type;
      config.operator = this.valueConfig.operator;
        switch (config.operator) {
          case Operator.NOT_BETWEEN:
          case Operator.BETWEEN: 
              config.value1 = this.valueConfig.value1;
              config.value2 = this.valueConfig.value2;
              config.operator = this.valueConfig.operator;
            break;
          default: 
            config.value1 = this.valueConfig.value1;
            config.operator = this.valueConfig.operator;
            break;
        }
    }
    return config;
  }

  private loadTimeConfig(): AlertConfiguration {
    let config: AlertConfiguration = null;
    if ((this.cron.timePlan == 'off' || this.cron.timePlan == undefined) && this.alert.type == AlertType.ENERGY) {
      config = new AlertConfiguration();
      config.type = AlertConfigType.TIME;
      config.operator = Operator.EQUAL;
      config.value1 = 'tl1';
    } else if (this.cron.timePlan != 'off') {
      config = new AlertConfiguration();
      config.type = AlertConfigType.TIME;
      if (this.cron.timePlan == 'CUSTOM' || this.cron.timePlan == 'on') {
        if (this.cron.from.time['hours'] != null && this.cron.from.time['minutes'] != null && this.cron.to.time['hours'] != null && this.cron.to.time['minutes'] != null) {
          config.operator = Operator.BETWEEN;
          config.value1 = `${this.cron.from.time['hours']}:${this.cron.from.time['minutes']}`;
          config.value2 = `${this.cron.to.time['hours']}:${this.cron.to.time['minutes']}`;
        }
        else if (this.cron.from.time['hours'] != null && this.cron.from.time['minutes'] != null) {
          config.operator = Operator.MIN;
          config.value1 = `${this.cron.from.time['hours']}:${this.cron.from.time['minutes']}`;
        }
        else if (this.cron.to.time['hours'] != null && this.cron.to.time['minutes'] != null) {
          config.operator = Operator.MAX;
          config.value1 = `${this.cron.to.time['hours']}:${this.cron.to.time['minutes']}`;
        }
      } else if (this.cron.timePlan != undefined) {
        config.operator = Operator.EQUAL;
        config.value1 = TimeLimit[this.cron.timePlan.toUpperCase()];
      }
      if (config.value1 == null) {
        config = null;
      }
    }
    return config;
  }

  private loadWeekDaysConfig(): AlertConfiguration {
    let config: AlertConfiguration = null;
    if (!this.cron.isAllDays()) {
      config = new AlertConfiguration();
      config.type = AlertConfigType.WEEK_DAYS;
      config.operator = Operator.IN;
      config.value1 = '';
      let daysArray = Object.values(this.cron.days);
      daysArray.forEach((e, index) => {
        if (e == true) {
          if (config.value1 != '') {
            config.value1 += ', ';
          }
          config.value1 += index;
        }
      });
    }
    return config;
  }

  private loadDateConfig(): AlertConfiguration {
    let config: AlertConfiguration = new AlertConfiguration();
    config.type = AlertConfigType.DATE;
    if (this.cron.from.date != null && this.cron.to.date != null) {
      config.operator = Operator.BETWEEN;
      config.value1 = this.datePipe.transform(this.cron.from.date, 'yyyy-MM-dd');
      config.value2 = this.datePipe.transform(this.cron.to.date, 'yyyy-MM-dd');
    }
    else if (this.cron.from.date != null) {
      config.operator = Operator.MIN;
      config.value1 = this.datePipe.transform(this.cron.from.date, 'yyyy-MM-dd');
    }
    else if (this.cron.to.date != null) {
      config.operator = Operator.MAX;
      config.value1 = this.datePipe.transform(this.cron.to.date, 'yyyy-MM-dd');
    }
    if (config.value1 == null) {
      config = null;
    }
    return config;
  }

  private validateForm(): boolean {
    let validate: boolean = true;
    let valueCfg = this.loadValueConfig();
    if (this.showValue1) {
      if (valueCfg == null){
        validate = false;
        this.toastr.danger('Veuillez introduire une valeur.', 'Error');
      }

      if((valueCfg.operator == Operator.BETWEEN || valueCfg.operator == Operator.NOT_BETWEEN) 
      && (valueCfg.value1 == null || valueCfg.value2 == null)){
        validate = false;
        this.toastr.danger('Veuillez vérifier value', 'Error');
      }
      
      if(valueCfg.operator != Operator.BETWEEN && valueCfg.operator != Operator.NOT_BETWEEN && valueCfg.value1 == null){
        validate = false;
        this.toastr.danger('Veuillez vérifier value', 'Error');
      }

      if (valueCfg.value1!= null && +valueCfg.value1 < 0 && this.alert.type == AlertType.ENERGY) {
        validate = false;
        this.toastr.danger('Veuillez vérifier l\'energy value. the value should be > 0.', 'Error');
      }

      if (valueCfg.value2!= null && +valueCfg.value2 < 0 && this.alert.type == AlertType.ENERGY) {
        validate = false;
        this.toastr.danger('Veuillez vérifier l\'energy value. the value should be > 0.', 'Error');
      }

      
/*
      if(valueCfg.value1 == null && valueCfg.value2 == null && this.alert.type == 'TEMPERATURE_THRESHOLD' && this.customOn == true) {
        validate = false;
        this.toastr.danger('Veuillez introduire une valeur.', 'Error');
      }
      // if (valueCfg.operator == Operator.BETWEEN && valueCfg.value1 != 'Min threshold'
      //  && valueCfg.value2 != 'Max threshold' && valueCfg.value1 > valueCfg.value2) {
      //   validate = false;
      //   this.toastr.danger(`Veuillez vérifier l'interval de valeur.`, 'Error');
      // }

      if(this.alert.type == 'TEMPERATURE_THRESHOLD'  &&  this.placeholderValue1 == '<NO VALUE>'  && this.placeholderValue2 == '<NO VALUE>' 
      && valueCfg.value1 == null && valueCfg.value2 == null ) {
        validate = false;
        this.toastr.danger('Veuillez vérifier les seuils de température.', 'Error', {duration:5000});
      }

      if (((valueCfg.value1 != 'Min threshold' && +valueCfg.value1 < -40 || +valueCfg.value1 > 125) || (valueCfg.value2 != 'Min threshold' && +valueCfg.value2 < -40 || +valueCfg.value2 > 125)) && this.alert.type == AlertType.TEMPERATURE_THRESHOLD) {
        validate = false;
        this.toastr.danger('Veuillez vérifier les seuils de température.', 'Error');
      }
      if ((+valueCfg.value1 < 5 || +valueCfg.value1 > 100 || +valueCfg.value2 < 5 || +valueCfg.value2 > 100) && this.alert.type == AlertType.VARIATION) {
        validate = false;
        this.toastr.danger('Veuillez vérifier the variation value. the value should be between 1 and 100.', 'Error');
      }
      if (+valueCfg.value1 < 0 && this.alert.type == AlertType.ENERGY) {
        validate = false;
        this.toastr.danger('Veuillez vérifier the energy value. the value should be > 0.', 'Error');
      }*/
      
    }
    if ((this.cron.from.time['hours'] == null || this.cron.to.time['hours'] == null) && this.cron.timePlan == 'CUSTOM') {
      validate = false;
      this.toastr.danger('Veuillez introduire Time plan.', 'Error');
    }
    if (((this.cron.from.date != null && this.cron.to.date != null) && this.cron.from.date > this.cron.to.date) || (this.cron.to.date != null && this.cron.to.date < new Date())) {
      validate = false;
      this.toastr.danger('Veuillez vérifier les dates .', 'Error');
    }
    if (this.measureIds.length == 0 && this.alert.id == 0) {
      validate = false;
      this.toastr.danger('Veuillez introduire mesures.', 'Error');
    }

    if (!this.alert.email) {
      validate = false;
      this.toastr.danger('Veuillez introduire emails', 'Error');
    }
    return validate;
  }

  showAdvancedSettings = false;
  collapseAdvancedSettings() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }

  emailInput: string;
  onAddEmail() {
    let array = this.alert.email.split(',').filter(email => email.trim() == this.emailInput);
    if (array.length > 0) {
      this.toastr.danger('Adresse mail existe déja!', 'Error');
    } else {
      if (!this.alert.email && this.emailInput) { this.alert.email = this.emailInput; this.emailInput = ''; }
      if (this.emailInput && this.alert.email) { this.alert.email += ', ' + this.emailInput; this.emailInput = ''; }
    }
    this.emailInput = undefined;
  }

  smsInput: string;
  onAddSms() {
    let array = this.alert.sms.split(',').filter(sms => sms.trim() == this.smsInput);
    if (array.length > 0) {
      this.toastr.danger('Numéro de téléphone existe déja!', 'Error');
    }
    else {
      if (!this.alert.sms && this.smsInput) { this.alert.sms = this.smsInput; this.smsInput = ''; }
      if (this.smsInput && this.alert.sms) { this.alert.sms += ', ' + this.smsInput; this.smsInput = ''; }
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /*private energyThreshold(tl?: string) {
    tl = (tl == null) ? this.cron.timePlan : tl;
    if (!this.explicitMinValue) {
      console.log("energy threshold");
      let groupId = this.alert.id == 0 ? this.measureIds[0] : this.alert.measureId;
      let group: Group = this.dataService.tenantData.zones.flatMap(zone => zone.installations)
        .flatMap(installation => installation.groupses)
        .find(group => group.id == groupId);
      this.thresholds = (group != undefined) ? { threshold: group.threshold, dayThreshold: group.thresholdDay, nightThreshold: group.thresholdNight } : { threshold: null, dayThreshold: null, nightThreshold: null };
      if (owner == 'AZIZA' && tl == 'OPENED') { this.valueConfig.value1 = this.thresholds['dayThreshold'] }
      else if (owner == 'AZIZA' && tl == 'CLOSED') { this.valueConfig.value1 = this.thresholds['nightThreshold'] }
      else this.valueConfig.value1 = this.thresholds['threshold'];
    }
  }*/

  getDefaultOperator(alertType){
    switch (alertType) {
      case 'DISCONNECTION': 
        return null;
      case 'VARIATION': 
      case 'ENERGY': 
        return Operator.MAX;
      case 'TEMPERATURE_THRESHOLD': 
        return Operator.NOT_BETWEEN;
      case 'SIMPLE':
      case 'AMPERAGE':
      case 'VOLTAGE':
      case 'POWER':
      case 'DEPHASAGE':
        return this.valueConfig.operator = Operator.MAX;
      case 'SIMPLE_VAL':
        return this.valueConfig.operator = Operator.EQUAL;
    }
  }

  customInit(){
    switch(this.alert.type + ''){ 
      case 'TEMPERATURE_THRESHOLD':
        this.disableValue1 = this.disableValue2 = true;
        // one sonde selected -- add, edit
        if(this.measureIds.length == 1) {
          this.alert.measureId = this.measureIds[0];
        } 
        if(this.alert.measureId) { 
          let sonde: SondeData;
          if(this.sondeService.sondes.length <= 0) {
            this.sondeService.findAll(+localStorage.getItem('id')).subscribe(
              data => {
                this.sondeService.sondes = data;
                sonde =  this.sondeService.sondes.find(s => s.id == this.alert.measureId);
                this.placeholderValue1 = sonde ? sonde.minThreshold!= null ? sonde.minThreshold+'' : '<NO VALUE>' +'' : '<NO VALUE>';
                this.placeholderValue2 = sonde ? sonde.maxThreshold != null? sonde.maxThreshold  +'' : '<NO VALUE>' : '<NO VALUE>';
                this.valueConfig.value1 = 'Min threshold';
                this.valueConfig.value2 = 'Max threshold';
                if(this.alert.id > 0) {
                  this.customOn = !(this.valueConfig.value1+'').endsWith('threshold') && !(this.valueConfig.value2+'').endsWith('threshold');
                } 

                  if(this.customOn){
                    this.placeholderValue1 = 'Min value'; this.placeholderValue2 ='Max value';
                    this.disableValue1 = this.disableValue2 = false;
                  } else {
                    this.valueConfig.value1 = 'Min threshold';
                    this.valueConfig.value2 = 'Max threshold';
                  }

              });
          } else {
            sonde =  this.sondeService.sondes.find(s => s.id == this.alert.measureId);
            this.placeholderValue1 = sonde ? sonde.minThreshold != null? sonde.minThreshold+'' : '<NO VALUE>' +'' : '<NO VALUE>';
            this.placeholderValue2 = sonde ? sonde.maxThreshold != null ? sonde.maxThreshold  +'' : '<NO VALUE>' : '<NO VALUE>';
            if(this.alert.id > 0) {
              this.customOn = !(this.valueConfig.value1+'').endsWith('threshold') && !(this.valueConfig.value2+'').endsWith('threshold');
            }
            if(this.customOn) {
              this.placeholderValue1 = 'Min value'; this.placeholderValue2 ='Max value';
              this.disableValue1 = this.disableValue2 = false;
            } else {
              this.valueConfig.value1 = 'Min threshold';
              this.valueConfig.value2 = 'Max threshold';
            }
            
        }
      } else { // multiple sondes (add only)
        if(this.customOn){
          this.placeholderValue1 = 'Min value'; this.placeholderValue2 ='Max value';
          this.disableValue1 = this.disableValue2 = false;
        } else {
          this.placeholderValue1 = 'Min threshold'; this.placeholderValue2 ='Max threshold';
          this.disableValue1 = this.disableValue2 = true;
        }
       }
      
        break;
    }

  }

  customValue(config: AlertConfiguration): boolean {
    switch(this.alert.type + '') { 
      case 'TEMPERATURE_THRESHOLD':
        let sonde =  this.sondeService.sondes.find(s => s.id == this.alert.measureId? this.alert.measureId : this.measureIds[0]);
       switch (this.customOn){
         case true: 
         if(this.valueConfig.value1 != null){
          config.value1 = this.valueConfig.value1;
          config.operator = Operator.MAX;
        }
        if(this.valueConfig.value2 != null ) {
          config.value2 = this.valueConfig.value2;
          config.operator = Operator.MIN;
        }
         break;
         case false: 
         if( sonde != undefined && sonde.minThreshold != null) {
          config.value1 = 'Min threshold';
          config.operator = Operator.MAX;
          }
          if( sonde != undefined && sonde.maxThreshold != null) {
            config.value2 = 'Max threshold';
            config.operator = Operator.MIN;
            }
         break;
       }
        if(config.value2 != null && config.value1 != null) {
          config.operator = Operator.NOT_BETWEEN;
        }
        return true;
    }
    return false;
  }

  onCustomValue(value : boolean) {
    this.customOn = value;
    switch (this.customOn) {
      case true : 
        this.valueConfig.value1 = null;
        this.valueConfig.value2 = null;
      break;
      case false : 
      this.valueConfig.value1 = 'Min threshold';
      this.valueConfig.value2 = 'Max threshold';
    }
    this.customInit();
  }

  getUnit():string {
    return this.alertService.getUnit(this.alert.type);
  }

  onOperatorChange(event) {
    switch(event){
      case Operator.BETWEEN:
      case Operator.NOT_BETWEEN:
        this.showValue2 = true;
        this.showValue1 = true;
        this.placeholderValue1 = "Min value";
      break;
      case Operator.NONE:
        this.showValue1 = false;
        this.showValue2 = false;
      break;
      case Operator.MAX:
        this.placeholderValue1 = "Max value";
        this.showValue1 = true;
        this.showValue2 = false;
        break;
        case Operator.MIN:
          this.placeholderValue1 = "Min value";
          this.showValue1 = true;
          this.showValue2 = false;
          break;
      default:
        this.placeholderValue1 = "value";
        this.showValue1 = true;
        this.showValue2 = false;
      break; 
    }
  }
}
