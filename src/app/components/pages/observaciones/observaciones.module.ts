import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservacionesRoutingModule } from './observaciones-routing.module';
import { ObservacionesComponent } from './observaciones.component';
import {MaterialModule} from "../../../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

@NgModule({
  declarations: [ObservacionesComponent],
  imports: [
    CommonModule,
    ObservacionesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ObservacionesModule { }
