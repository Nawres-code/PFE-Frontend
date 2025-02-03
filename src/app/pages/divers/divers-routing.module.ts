import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiversComponent } from './divers/divers.component';

const routes: Routes = [{
  path: '',
  component: DiversComponent,
  children: [],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiversRoutingModule { }
