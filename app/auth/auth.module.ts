import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { authRoutes } from './auth.routing';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { LoginComponent } from './login.component';
import { RegistrationComponent }   from './registration.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule
  ],
  exports: [],
  declarations: [
    LoginComponent,
    RegistrationComponent
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AuthModule { }