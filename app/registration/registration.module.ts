import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { routing } from './registration.routing';
import { RegistrationComponent }   from './registration.component';
import { RegistrationStep1Component } from './registration-step1.component';
import { RegistrationStep2Component } from './registration-step2.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [
    RegistrationComponent,
    RegistrationStep1Component,
    RegistrationStep2Component
  ],
  providers: [],
})
export class RegistrationModule { }
