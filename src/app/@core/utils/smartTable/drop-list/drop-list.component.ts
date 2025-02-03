import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-drop-list',
  template: `
        <span class="px-3 py-2 ">{{ val }}</span>
  `,
  styleUrls: ['./drop-list.component.scss']
})
export class DropListComponent implements ViewCell, OnInit {

  @Input() value: any;
  @Input() rowData: any;
  @Output() OnEdit = new EventEmitter();

  editMode: boolean = true;
  list: any[];
  placeholder: string = '';

  val: string;

  constructor(private dropListCellService: DropListCellService) { 
  }

  ngOnInit() { 
    this.val = this.value;
    this.dropListCellService.list = this.list;
    this.dropListCellService.placeholder = this.placeholder;
  }
}

@Component({
  selector: 'ngx-drop-list-edit',
  template: `
      <nb-select [placeholder]="dropListCellService.placeholder" 
          [(selected)]="cell.newValue" class="col-12 col-md-1 px-0">
            <nb-option *ngFor="let item of dropListCellService.list" [value]="item">
             {{item | uppercase}} 
            </nb-option>
      </nb-select>
      `,
  styleUrls: ['./drop-list.component.scss']
})
export class DropListEditComponent extends DefaultEditor implements OnInit {

  constructor(public dropListCellService:DropListCellService) {
    super();
  }
  value: string | number;
  rowData: any;

  ngOnInit() {
    this.cell.newValue = this.cell.getValue();
  }
}


@Component({
  selector: 'ngx-drop-list',
  template: `
        <span class="px-3 py-2 ">{{ val }}</span>
  `,
  styleUrls: ['./drop-list.component.scss']
})
export class ConfigurationDropListComponent implements ViewCell, OnInit {

  @Input() value: any;
  @Input() rowData: any;
  @Output() OnEdit = new EventEmitter();

  editMode: boolean = true;
  list: any[];
  placeholder: string = '';

  val: string;

  constructor(private configurationDropListCellService: ConfigurationDropListCellService) { 
  }

  ngOnInit() { 
    this.val = this.value;
    this.configurationDropListCellService.list = this.list;
    this.configurationDropListCellService.placeholder = this.placeholder;
  }
}

@Component({
  selector: 'ngx-drop-list-edit',
  template: `
      <nb-select [placeholder]="configurationDropListCellService.placeholder" 
          [(selected)]="cell.newValue" class="col-12 col-md-1 px-0">
            <nb-option *ngFor="let item of configurationDropListCellService.list" [value]="item">
             {{item | uppercase}} 
            </nb-option>
      </nb-select>
      `,
  styleUrls: ['./drop-list.component.scss']
})
export class ConfigurationDropListEditComponent extends DefaultEditor implements OnInit {

  constructor(public configurationDropListCellService:ConfigurationDropListCellService) {
    super();
  }
  value: string | number;
  rowData: any;

  ngOnInit() {
    this.cell.newValue = this.cell.getValue();
  }
}


@Injectable({
  providedIn: 'root'
}) 
export class DropListCellService { 
  list:any[] = [];
  placeholder: string = '';
}

@Injectable({
  providedIn: 'root'
}) 
export class ConfigurationDropListCellService { 
  list:any[] = [];
  placeholder: string = '';
}