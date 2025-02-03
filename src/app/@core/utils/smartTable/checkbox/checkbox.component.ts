import { Component, Input, OnInit } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-checkbox',
  template: `
    <input 
      type="checkbox"
      (click)="changeBoolean()"
      [checked]="checked"> `,
  styleUrls: []

})
export class CheckboxComponent implements ViewCell, OnInit {
 
  @Input() value: any;
  @Input() rowData: any;

  checked: boolean;

  constructor() { }

  ngOnInit() {
    this.checked = this.value;
  }

  changeBoolean() {
    event.preventDefault();
   // this.checked = !this.checked;
  }

}
@Component({
  selector: 'ngx-checkbox-edit',
  template: `
    <input 
      type="checkbox"
      [(ngModel)]="checked" (ngModelChange)="onChange()"> `,
      styleUrls: []
    
})
export class CheckboxEditComponent extends DefaultEditor implements OnInit {

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
