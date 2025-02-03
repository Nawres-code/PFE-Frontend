import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Inputs } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { InputService } from '../../../@core/service/input.service';
import { LayoutService } from '../../../@core/utils';
@Component({
  selector: 'ngx-inputs-management',
  templateUrl: './inputs-management.component.html',
  styleUrls: ['./inputs-management.component.scss']
})
export class InputsManagementComponent{

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private inputService: InputService,
     private dataManagementService: DataManagementService,
     private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

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

  init() {
    this.source = new LocalDataSource
    (this.dataManagementService.tenantData.zones[0].installations[0].inputs
      .map(inp=>
      { let inp2 = inp;
        inp2['categoryName']=inp.category.name;
        return inp2;
    }).sort((a,b) => (a.category.name > b.category.name ) ? 1 : ((b.category.name  > a.category.name ) ? -1 : 0))
    );

   /* let categories = [];
    this.dataManagementService.tenantData.zones[0].installations[0].inputs
    .map(inp => inp.category).forEach( c => {
       if (categories.map(ct => ct.name).indexOf(c.name)<0) {
         categories.push(c); 
       }
    });

    this.settings.columns.categoryName.editor.config.list= categories.map(ct=>{return {value:ct.id, title:ct.name};});
    this.settings=Object.assign({},this.settings);*/
  }

  onDeleteConfirm(event): void {
    if (window.confirm(`Are you sure you want to delete ${event.data.name}?`)) {
      let selectedId = event.data.id;
      
      let index = this.dataManagementService.tenantData.zones[0].installations[0].inputs.findIndex(s => s.id == selectedId);
      if (index > -1) {
        //console.log('selectedId: ' + selectedId + ', index: '+ index);
        event.confirm.resolve();
      }
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
   if (window.confirm(`Are you sure you want to edit ${event.newData.name} ?`)) {
     let input: Inputs = this.dataManagementService.tenantData.zones[0].installations[0].inputs
            .find(inp=> inp.id == event.newData.id);
     input.name = event.newData.name;
      if (input != undefined && input != null) {
        this.inputService.updateInput(input).subscribe(
          resp => {
            event.confirm.resolve(event.newData);
          });
      }
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
  /*  delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },*/
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
      categoryName:  {
        title: 'Départ',
        type: 'string',
        // editor: {
        //   type: 'list',
        //   config: {
        //     list: []
        //   }
        // },
        editable: false,
        filter: true
      },
     // color
    },
  };
}

