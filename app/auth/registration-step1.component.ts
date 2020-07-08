import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  selector: 'tradity-registration-step1',
  template: `
    <form (ngSubmit)="parent.register1()" tradity-form>
      <tradity-input type="text" prefix="person" placeholder="User name" i18n-placeholder name="username" [(ngModel)]="parent.username" autofocus></tradity-input>
      <tradity-input type="email" prefix="email" placeholder="Email address" i18n-placeholder name="email" [(ngModel)]="parent.email"></tradity-input>
      <tradity-input type="password" prefix="lock" placeholder="Password" i18n-placeholder name="password" [(ngModel)]="parent.password"></tradity-input>
      <tradity-input type="password" prefix="lock" placeholder="Repeat password" i18n-placeholder name="passwordCheck" [(ngModel)]="parent.passwordCheck"></tradity-input>
      <input type="checkbox" name="agb" id="agb" [(ngModel)]="parent.agb" /><label for="agb"><span>Ich akzeptiere die <a target="_blank" href="https://tradity.de/agb">AGB</a> und habe die <a target="_blank" href="img/Datenschutzerklaerung.pdf">Datenschutzerklärung</a> gelesen.</span></label>
      <button tradity-button type="submit" [disabled]="!(parent.username && parent.email && parent.password && parent.passwordCheck && parent.agb)" i18n>Continue</button>
    </form>`
})
export class RegistrationStep1Component {
  constructor(public parent: RegistrationComponent) { }
}