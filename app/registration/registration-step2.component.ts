import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-registration-step2',
  templateUrl: 'registration-step2.component.html'
})
export class RegistrationStep2Component implements OnInit {
  constructor(private parent: RegistrationComponent) { }

  ngOnInit() { }
}