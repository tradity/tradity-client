
import {map} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription ,  Observable } from 'rxjs';

import * as authActions from './auth.actions';
import { getInputFocus } from '../app.reducer';
import { UserService } from '../core/user.service';
import { GroupService } from '../core/group.service';

@Component({
  selector: 'tradity-registration',
  template: `
    <img title="Tradity" alt="Tradity" src="/img/tradity_symbol.png" />
    <h2 i18n>Sign Up</h2>
    <form *ngIf="step === 1" (ngSubmit)="register1()" tradity-form>
      <tradity-input type="text" prefix="person" placeholder="User name" i18n-placeholder name="username" [(ngModel)]="username" autofocus></tradity-input>
      <tradity-input type="email" prefix="email" placeholder="Email address" i18n-placeholder name="email" [(ngModel)]="email"></tradity-input>
      <tradity-input type="password" prefix="lock" placeholder="Password" i18n-placeholder name="password" [(ngModel)]="password"></tradity-input>
      <tradity-input type="password" prefix="lock" placeholder="Repeat password" i18n-placeholder name="passwordCheck" [(ngModel)]="passwordCheck"></tradity-input>
      <input type="checkbox" name="agb" id="agb" [(ngModel)]="agb" /><label for="agb"><span>Ich akzeptiere die <a target="_blank" href="https://tradity.de/agb">AGB</a> und habe die <a target="_blank" href="img/Datenschutzerklaerung.pdf">Datenschutzerklärung</a> gelesen.</span></label>
      <button tradity-button type="submit" [disabled]="!(username && email && password && passwordCheck && agb)" i18n>Continue</button>
    </form>
    <form *ngIf="step === 2" (ngSubmit)="register2()" tradity-form>
      <tradity-input type="text" placeholder="Given name" i18n-placeholder name="givenName" [(ngModel)]="givenName" autofocus></tradity-input>
      <tradity-input type="text" placeholder="Surname" i18n-placeholder name="surname" [(ngModel)]="surname"></tradity-input>
      <select name="city" [(ngModel)]="city" (ngModelChange)="loadSubGroups()">
        <option selected value="">Wähle deine Metropole</option>
        <option value="" i18n>Nur Bundeswettbewerb</option>
        <option *ngFor="let city of groupList" [value]="city.path">
          {{city.name}}
        </option>
      </select>
      <select name="school" [(ngModel)]="school" *ngIf="city">
        <option selected value="" i18n>Select your school</option>
        <option *ngFor="let school of subGroups" [value]="school.path">
          {{school.name}}
        </option>
      </select>
      <tradity-input type="text" placeholder="Stadt" name="class" [(ngModel)]="class"></tradity-input>
      <button tradity-button type="submit" [disabled]="!(givenName && surname)" i18n>Sign up</button>
    </form>
    <div>
      <a role="button" (click)="resetPassword()" i18n>Forgot Password?</a> · <a [routerLink]="['/login']" i18n>Login</a>
    </div>`,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 100px;
    }
    
    img {
      width: 100px;
      height: 100px;
      margin: 60px 0 0;
    }
    
    h2 {
      margin: 30px 0 36px;
      font-size: 20px;
      font-weight: 900;
      line-height: 24px;
      color: #170804;
    }
    
    :host >>> [tradity-form] {
      margin: 0 3em;
    }
    
    div {
      margin-top: 20px;
    }
    
    div a {
      color: #F1592A;
      text-decoration: none;
    }`]
})
export class RegistrationComponent implements OnDestroy {
  step = 1;
  username = '';
  email = '';
  password = '';
  passwordCheck = '';
  givenName = '';
  surname = '';
  city = '';
  school = '';
  class = '';
  agb = false;

  private groupListSubscription: Subscription;
  groupList: any;
  subGroups: Array<any>;
  inputFocus: Observable<boolean>;

  constructor(private router: Router, private store: Store<any>, private userService: UserService, private groupService: GroupService) {
    this.groupListSubscription = this.groupService.groupList.pipe(
      // filter for top-level groups
      map(res => res.filter(val => val.path.split('/').length - 1 === 1)))
      .subscribe(res => this.groupList = res);
    
    this.inputFocus = this.store.select(getInputFocus);
  }

  ngOnDestroy() {
    this.groupListSubscription.unsubscribe();
  }

  loadSubGroups() {
    this.groupService.getSubGroups(this.city)
    .subscribe(res => this.subGroups = res);
  }

  register1() {
    this.userService.checkUsernameAndEmail(this.username, this.email)
    .subscribe(
      res => {
        if (this.password !== this.passwordCheck) {
          alert('The passwords do not match');
        } else if (this.password.length < 5) {
          alert('The password is too short');
        } else {
          this.step = 2;
        }
      },
      err => {
        switch (err.message) {
          case '/validate-username/:name: 403: already-present':
            alert('The username has already been taken');
            break;
          case '/validate-username/:name: 403: invalid-char':
            alert('The username contains invalid characters');
            break;
          case '/validate-email/:email: 403: already-present':
            alert('The email address has already been used');
            break;
          case '/validate-email/:email: 403: invalid-email':
            alert('The email address contains invalid characters');
            break;
        }
      }
    );
  }

  register2() {
    this.store.dispatch(new authActions.Register({
      name: this.username,
      email: this.email,
      password: this.password,
      giv_name: this.givenName,
      fam_name: this.surname,
      school: this.school || null,
      schoolclass: this.class || null
    }))
  }

  resetPassword() {
    this.userService.resetPassword();
  }
}