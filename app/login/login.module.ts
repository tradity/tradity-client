import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login.component';
import { routing } from './login.routing';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: [],
})
export class LoginModule { }
