import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  selector: 'tradity-registration-step2',
  templateUrl: 'registration-step2.component.html'
})
export class RegistrationStep2Component {
  constructor(public parent: RegistrationComponent) { }
}