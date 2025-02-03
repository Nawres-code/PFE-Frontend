import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { MENU_ITEMS } from '../../pages/pages-menu';

@Injectable({
  providedIn: 'root'
})
export class MyTranslateService  implements OnDestroy{

  public translate$: EventEmitter<void> = new EventEmitter();

  menu = [...MENU_ITEMS];
  alive: boolean = true
  constructor(private translateService: TranslateService) {
   
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  translateMenu() {
    this.translateService.get(
    this.menu.map(item => "MENU."+item.data)
    .concat(this.menu.flatMap(item=> item.children)
    .filter(el=> el!=null).map(item => "MENU."+item.data)))
    .pipe(takeWhile(() => this.alive))
    .subscribe( resp => {
      this.menu.forEach(el => {
        if(el.data != undefined) {
          el.title = resp['MENU.' + el.data];
        }
        try {
          el.children.forEach(subEl=> {
            if(subEl.data != undefined) {
              subEl.title = resp['MENU.' + subEl.data];
            }
          });
        } catch (error) { }
        
      });
    });
  }


}
