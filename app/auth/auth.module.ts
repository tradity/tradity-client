import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { routing } from './auth.routing';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    FormsModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: [],
})
export class AuthModule { }