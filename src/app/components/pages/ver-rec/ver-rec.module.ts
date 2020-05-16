import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerRecRoutingModule } from './ver-rec-routing.module';
import { VerRecComponent } from './ver-rec.component';
import {MaterialModule} from "../../../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

@NgModule({
  declarations: [VerRecComponent],
  imports: [
    CommonModule,
    VerRecRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class VerRecModule { }
