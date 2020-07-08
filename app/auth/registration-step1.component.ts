import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  selector: 'tradity-registration-step1',
  templateUrl: 'registration-step1.component.html'
})
export class RegistrationStep1Component {
  constructor(public parent: RegistrationComponent) { }
}