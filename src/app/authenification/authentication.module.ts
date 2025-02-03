import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SigninService } from '../@core/service/signin.service';
import { SubAccountService } from '../@core/service/sub-account.service';

import { ThemeModule } from '../@theme/theme.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    ThemeModule,
    FormsModule,
    TranslateModule,
    NbSelectModule
  ],
  declarations: [
    SigninComponent,
    AuthenticationComponent
  ],
  providers:[
    SigninService,
    SubAccountService
],
exports :[
  
]

})
export class AuthenticationModule {
}
