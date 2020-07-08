import { Component, OnInit } from '@angular/core';

import { RegistrationComponent } from './registration.component';

@Component({
  selector: 'tradity-registration-step2',
  template: `
    <form (ngSubmit)="parent.register2()" tradity-form>
      <tradity-input type="text" placeholder="Given name" i18n-placeholder name="givenName" [(ngModel)]="parent.givenName" autofocus></tradity-input>
      <tradity-input type="text" placeholder="Surname" i18n-placeholder name="surname" [(ngModel)]="parent.surname"></tradity-input>
      <select name="city" [(ngModel)]="parent.city" (ngModelChange)="parent.loadSubGroups()">
        <option selected value="">Wähle deine Metropole</option>
        <option value="" i18n>Nur Bundeswettbewerb</option>
        <option *ngFor="let city of parent.groupList" [value]="city.path">
          {{city.name}}
        </option>
      </select>
      <select name="school" [(ngModel)]="parent.school" *ngIf="parent.city">
        <option selected value="" i18n>Select your school</option>
        <option *ngFor="let school of parent.subGroups" [value]="school.path">
          {{school.name}}
        </option>
      </select>
      <tradity-input type="text" placeholder="Stadt" name="class" [(ngModel)]="parent.class"></tradity-input>
      <button tradity-button type="submit" [disabled]="!(parent.givenName && parent.surname)" i18n>Sign up</button>
    </form>`
})
export class RegistrationStep2Component {
  constructor(public parent: RegistrationComponent) { }
}