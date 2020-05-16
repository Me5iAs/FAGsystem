import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerRecComponent } from './ver-rec.component';

const routes: Routes = [{ path: '', component: VerRecComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerRecRoutingModule { }
