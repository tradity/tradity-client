import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { routing } from './auth.routing';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { LoginComponent } from './login.component';
import { RegistrationComponent }   from './registration.component';
import { RegistrationStep1Component } from './registration-step1.component';
import { RegistrationStep2Component } from './registration-step2.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    RegistrationStep1Component,
    RegistrationStep2Component
  ],
  providers: [],
})
export class AuthModule { }