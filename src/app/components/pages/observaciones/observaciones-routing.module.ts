import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservacionesComponent } from './observaciones.component';

const routes: Routes = [{ path: '', component: ObservacionesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionesRoutingModule { }
