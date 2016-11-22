import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { RegistrationComponent }   from './registration.component';
import { routing } from './registration.routing';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [RegistrationComponent],
  providers: [],
})
export class RegistrationModule { }
