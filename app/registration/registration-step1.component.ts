import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-registration-step1',
  templateUrl: 'registration-step1.component.html'
})
export class RegistrationStep1Component implements OnInit {
  constructor(public parent: RegistrationComponent) { }

  ngOnInit() { }
}