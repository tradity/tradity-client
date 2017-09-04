import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { routing } from './auth.routing';
import { LoginComponent } from './login.component';

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
export class AuthModule { }