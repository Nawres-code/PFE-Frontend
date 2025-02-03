import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbToastrModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbTimepickerModule,
  NbInputModule,
  NbAccordionModule,
  NbSpinnerModule,
  NbToggleModule,
  NbListModule,
  NbTagModule,
  NbDateTimePickerComponent
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  TinyMCEComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  OneColumnFooterLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { owner, themeName } from '../global.config';
import { OneColumnHeaderFooterLayoutComponent } from './layouts/one-column-header-footer/one-column-header-footer.layout';
import { TranslateModule } from '@ngx-translate/core';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbCardModule,
  NbToastrModule.forRoot(),
  NbTooltipModule,
  NbMenuModule.forRoot(),
  NbDatepickerModule.forRoot(),
  NbTimepickerModule.forRoot(),
  NbDialogModule.forRoot(),
  NbWindowModule.forRoot(),
  NbTimepickerModule.forRoot(),
  NbButtonModule,
  NbInputModule,
  NbAccordionModule,
  NbSpinnerModule,
  NbListModule,
  NbTagModule
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  OneColumnFooterLayoutComponent,
  OneColumnHeaderFooterLayoutComponent
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, TranslateModule],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: themeName,
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers
      ],
    };
  }

}
