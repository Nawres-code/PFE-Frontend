import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { InputCategory, Inputs } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { InputService } from '../../../@core/service/input.service';
import { LayoutService } from '../../../@core/utils';
import { orderByField } from '../../../@core/utils/global/order';
@Component({
  selector: 'ngx-cat-inputs-management',
  templateUrl: './cat-inputs-management.component.html',
  styleUrls: ['./cat-inputs-management.component.scss']
})
export class CatInputsManagementComponent{

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private inputService: InputService,
     private dataManagementService: DataManagementService
     ,private sidebarService:NbSidebarService, 
     private layoutService:LayoutService) { 

      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }
     try{
      this.init();
    } catch(e){
      this.dataManagementService.GroupsLoaded$.subscribe(tenantData => this.init());
      this.dataManagementService.init();
    }
  }

  categoriesList: InputCategory[] = [];

  init() {
    let catIds = new Set<number>();
    let allCats = this.dataManagementService.tenantData.zones[0].installations[0].inputs.map(inp=>inp.category);
    this.dataManagementService.tenantData.zones[0].installations[0].inputs.map(inp=> inp.category.id)
    .forEach( c => { catIds.add(c);});
    let cats= new Set<InputCategory>();
    catIds.forEach(x => cats.add(allCats.find(inp=>inp.id==x)));
    this.categoriesList = orderByField(Array.from(cats),'name');

    this.source = new LocalDataSource(this.categoriesList);
  }

  onDeleteConfirm(event): void {
    if (window.confirm(`Are you sure you want to delete ${event.data.name}?`)) {
      let selectedId = event.data.id;
      
      let index = this.dataManagementService.tenantData.zones[0].installations[0].inputs.findIndex(s => s.id == selectedId);
      if (index > -1) {
        event.confirm.resolve();
      }
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    let cat = this.categoriesList.find(inp=>inp.id == event.data.id);
    cat.name = event.newData.name;
   if (window.confirm(`Are you sure you want to edit ${event.data.name} ?`)) {
        this.inputService.renameCatInput(cat).subscribe(
          resp => {
            event.confirm.resolve(event.newData);
          });
   } else {
    event.confirm.reject();
  }
  }

  settings = {
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    actions: {
      add: false,
      delete: false,
      edit: true,
      position: 'left',
      columnTitle: '', // minimize the actions column size
    },
    columns: {
      id:  {
        title: 'Id',
        type: 'string',
        editable: false,
        filter: false
      },
	    name:  {
        title: 'Name',
        type: 'string',
        editable: true,
        filter: true
      },
    },
  };
}

