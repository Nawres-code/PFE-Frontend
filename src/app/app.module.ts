/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NbIconModule, NbSidebarModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NbSidebarModule,
    HttpClientModule,
    AppRoutingModule,
    NbIconModule,
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent],
  providers: [ ...NbSidebarModule.forRoot().providers ],

})
export class AppModule {
  constructor(public translate: TranslateService) {
    translate.addLangs(['fr', 'en']);
    translate.setDefaultLang('fr');
  }
}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

/* export function highchartsFactory() {
  const hc = require('highcharts');
  const hcm = require('highcharts/highcharts-3d');
  const exp = require('highcharts/modules/exporting');
  const sg = require('highcharts/modules/solid-gauge');
  const hm = require('highcharts/highcharts-more');
  const st = require('highcharts/modules/stock');
  const data = require('highcharts/modules/export-data');

  hcm(hc);
  exp(hc);
  sg(hc);
  st(hc);
  hm(hc);
  data(hc);
  return hc;
}*/
