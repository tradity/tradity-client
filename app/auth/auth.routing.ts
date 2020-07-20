import { Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { RegistrationComponent } from './registration.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/:emailVerifCode/:uid',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  }
]