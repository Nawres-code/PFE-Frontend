import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { MyTranslateService } from '../../../@core/service/my-translate.service';
import { LayoutService } from '../../../@core/utils';
import { User } from '../../../authenification/credentials';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-divers',
  templateUrl: './divers.component.html',
  styleUrls: ['./divers.component.scss'],
  host: {'class': 'h-100'}
})
export class DiversComponent implements OnInit, OnDestroy {
  isSingleView = false;
  cameras = [{title:'DIVERS.tgbt1',source:'https://traci.tn/images/issat/tgbt1.png'},
  {title:'DIVERS.tgbt2',source:'https://traci.tn/images/issat/tgbt2.png'}, 
  { title:'DIVERS.map',source:'https://traci.tn/images/issat/Maps_ISSATso.png'}];

  titles = [];

  alive: boolean = true;
  selectedCamera = this.cameras[0];
  constructor( private sidebarService:NbSidebarService, private layoutService:LayoutService,
    public myTranslateService: MyTranslateService, private TranslateService: TranslateService) { 
      this.getTitles();
      this.myTranslateService.translate$.pipe(takeWhile(() => this.alive))
      .subscribe(()=> this.getTitles());

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
  
  }

  private getTitles() {
    this.TranslateService.get(['DIVERS.tgbt1','DIVERS.tgbt2', 'DIVERS.map'])
    .subscribe (resp =>  this.titles = resp);
  }


  ngOnInit(): void {
   
  }

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }

  isIssat(): boolean{
    try {
      let user: User = JSON.parse(localStorage.getItem('currentUser'));
      return owner == 'ANME' && user.id == 31;
    } catch (error) {
      return false;
    }
  }

  ngOnDestroy(): void {
      this.alive = false;
  }

}
