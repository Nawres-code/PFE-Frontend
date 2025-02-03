import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphEntry } from '../../../../@core/data/comaparator';
import { Installation } from '../../../../@core/data/data';
import { DataManagementService } from '../../../../@core/service/data-management.service';
import { GraphService } from '../../../../@core/service/graph.service';
@Component({
  selector: 'ngx-power-action',
  templateUrl: './power-action.component.html',
  styleUrls: ['./power-action.component.scss']
})
export class PowerActionComponent implements OnInit {

  @Input() value: string | number;
  @Input() rowData: any;
  closeResult = '';

  selectedInstallation: Installation;

  constructor(private dataManagementService: DataManagementService, private graphService: GraphService, private _router: Router) { }

  ngOnInit() {
    this.selectedInstallation = this.dataManagementService.tenantData.zones.flatMap(z=> z.installations).find(i=> i.id == this.value);
  }

  open() {
    if(this.selectedInstallation) {
      this.selectedCompartorByType('ALL_POWER_MOY');
    }
  }

  selectedCompartorByType(type: string) {
    let endDate: Date = new Date();
    let startDate:Date = new Date();
    endDate.setHours(23, 59, 59, 0);
    startDate.setTime(startDate.getTime() - 3 * 86400000);
    startDate.setHours(0, 0, 0, 0);
    let graphEntry: GraphEntry ;
    switch (type) {
      case 'ALL_TMP':
        graphEntry = { installationName: this.selectedInstallation.name, 
            groupses: this.selectedInstallation.sondes, 
            period: 'Hours',
            status: false, 
            vars: 'temperature' }
          this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'ALL_POWER_MOY':
        graphEntry = { installationName: this.selectedInstallation.name,
           groupses: this.selectedInstallation.groupses, period: 'Hours', 
           status: false, vars: 'grouped_power_moy' }
        this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'TMP_POWER_MOY':
        // 
        graphEntry = { installationName: this.selectedInstallation.name,
          groupses: this.selectedInstallation.groupses, 
          period: 'Hours', 
          status: false, vars: 'grouped_power_moy' }
       this.graphService.addGraphSerie(graphEntry, startDate, endDate);
          //tmp
       graphEntry = { installationName: this.selectedInstallation.name, 
        groupses: this.selectedInstallation.sondes, 
        period: 'Hours', status: false, vars: 'temperature' }
      this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
      case 'AMBIENT_CLIM': 
        graphEntry = { installationName: this.selectedInstallation.name,
           groupses: this.selectedInstallation.groupses
                      .filter(g=> g.name == 'Climatisation')
           , period: 'Hours', status: false, vars: 'energy' }
        this.graphService.addGraphSerie(graphEntry, startDate, endDate);

        graphEntry = { installationName: this.selectedInstallation.name,
          groupses: this.selectedInstallation.sondes
                .filter(s=> s.type == 'Ambient')
          , period: 'Hours', status: false, vars: 'temperature' }
       this.graphService.addGraphSerie(graphEntry, startDate, endDate);
        break;
    }
    this._router.navigate(['/pages/historical/comparator']);
  }
}
