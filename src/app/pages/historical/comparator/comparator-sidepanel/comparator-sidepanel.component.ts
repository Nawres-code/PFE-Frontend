import { Component, OnDestroy } from '@angular/core';
import { FormComparatorComponent } from '../form-comparator/form-comparator.component';
import { NbDateTimePickerComponent, NbDialogService, NbToastrService } from '@nebular/theme';
import { GraphService } from '../../../../@core/service/graph.service';
import { owner } from '../../../../global.config';
import { delay, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';

@Component({
  selector: 'ngx-comparator-sidepanel',
  templateUrl: './comparator-sidepanel.component.html',
  styleUrls: ['./comparator-sidepanel.component.scss']
})
export class ComparatorSidepanelComponent implements OnDestroy {
  owner: string;

  alive:boolean = true;
  formControl  ;
  formControl1 ;
  disableFormBtn: boolean = true;

  destroy$: Subject<boolean> = new Subject<boolean>();

  faIcon = FA_ICONS;
  constructor(private dialogService: NbDialogService, 
    public graphService: GraphService, private toastr: NbToastrService,
    private dataManagementService: DataManagementService) {
    this.owner = owner;
     //date
     this.formControl = new FormControl(this.graphService.startDate);
     this.formControl1 = new FormControl(this.graphService.endDate);
     
    this.dataManagementService.GroupsLoaded$
           .pipe(takeWhile(() => this.alive))
           .pipe(delay(50))
           .subscribe(tenantData => {
             this.disableFormBtn = false;  
            });
            try {
              this.dataManagementService.tenantData.zones[0].name;
              this.disableFormBtn = false; 
            } catch (error) { }
     // Fix NbDateTimePickerComponent for @nebular/theme 9.0.0
    NbDateTimePickerComponent.prototype.ngOnInit = function () {
      this.format = this.format || this.buildTimeFormat();
      this.init$.next();
    };
    this.graphService.dateRangeChanged$
    .pipe(takeWhile(()=> this.alive))
    .subscribe(dates=> { 
      this.formControl = new FormControl(this.graphService.startDate);
      this.formControl1 = new FormControl(this.graphService.endDate); 
  });
  }

  openDialogue() {
    this.dialogService.open(FormComparatorComponent, { 'closeOnEsc': false, 'closeOnBackdropClick':false, 'hasScroll':true});
  }

  onReset() {
    this.graphService.reset();
  }

  onRemove(iEntry: number, iGroup: number) {
    this.graphService.removeGraphSerie(iEntry, iGroup);
  }

  onDateRangeChange(event, border: string) {
    if (this.graphService.startDate > this.graphService.endDate) {
      this.toastr.danger('Please verify the date range!', 'Error');
      this.graphService.reset();
    } else {
      this.graphService.startDate = (border == 'start')? event: this.graphService.startDate;
      this.graphService.endDate = (border == 'end')? event: this.graphService.endDate;
      if (this.graphService.graphEntries.length > 0){
        this.graphService.addGraphSerie(null, this.graphService.startDate, this.graphService.endDate, true);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.alive = false;
  }

  toggleList(){
    this.graphService.listShow = !this.graphService.listShow;
  }

}
