import { Component, Input, OnInit } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-selected',
  template: `
  <span *ngIf="selected" class="px-3 py-2 white-class badge rounded-pill">{{'SUB_ACC.selected' | translate}}</span>
  `,
  styleUrls: ['./selected.component.scss']
})
export class SelectedComponent implements ViewCell,OnInit {

  @Input() value: any;
  @Input() rowData: any;

  selected: boolean;

  constructor() { }

  ngOnInit() {
    this.selected = this.value;
  }

}
@Component({
  selector: 'ngx-selected-edit',
  template: `
    <input *ngIf="!checked"
      type="checkbox"
      [(ngModel)]="checked"  (ngModelChange)="onChange()">
      <span *ngIf="checked" class="px-3 py-2 white-class badge rounded-pill ">{{'SUB_ACC.selected' | translate}}</span>
      `,
  styleUrls: ['./selected.component.scss']
})
export class SelectedEditComponent extends DefaultEditor implements OnInit {

  constructor() {
    super();
   }

   checked: boolean;

  ngOnInit() {
    this.checked = this.cell.getValue()
    this.cell.newValue = this.checked;
  }

  onChange() {
      this.cell.newValue = this.checked;
  }

}
