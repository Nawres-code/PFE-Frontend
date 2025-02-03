import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { owner } from '../../../global.config';
import { SigninService } from '../../../@core/service/signin.service';
import { Router } from '@angular/router';
import { User } from '../../../authenification/credentials';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../@core/service/my-translate.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;
  owner = owner;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];
  selectedLanguage: string = undefined;
  
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private router: Router,
              public translate: TranslateService,
              private myMenuService:MyTranslateService) {
              this.selectedLanguage = localStorage.getItem('lang');
              this.translateLanguageTo(this.selectedLanguage != null? this.selectedLanguage :  this.translate.getLangs()[0]);
            }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  getConnectedId(): number {
    return +localStorage.getItem("id");
  }

  isSuperAdmin(): boolean {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    return this.user.roles.find(r=> r=="ROLE_SUPER_ADMIN") != undefined;
  }

  logout() {
    this.router.navigate(["/signin"], { queryParams: { 'logout': '' } });
  }

  translateLanguageTo(lang: string) {
    if(lang != undefined && lang != null)
    {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
      this.myMenuService.translate$.emit();
    }
  }

  
}
