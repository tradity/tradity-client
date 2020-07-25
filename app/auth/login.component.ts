import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserService } from '../core/user.service';
import * as authActions from './auth.actions';
import { getInputFocus } from '../app.reducer';

@Component({
  selector: 'tradity-login',
  template: `
    <img title="Tradity" alt="Tradity" src="/img/tradity_symbol.png" />
    <h2 i18n>Welcome back!</h2>
    <form (submit)="submit($event)">
      <tradity-input type="text" placeholder="User name" name="username" [value]="form.username" (input)="updateForm($event)" autofocus></tradity-input>
      <tradity-input type="password" placeholder="Password" name="password" [value]="form.password" (input)="updateForm($event)"></tradity-input>
      <tradity-checkbox name="stayLoggedIn" [value]="form.stayLoggedIn" (input)="updateForm($event)">Remember me</tradity-checkbox>
      <button tradity-button type="submit" [disabled]="!(form.username && form.password)" i18n>Log in</button>
    </form>
    <div>
      <a role="button" (click)="resetPassword()" i18n>Forgot Password?</a> · <a [routerLink]="['/register']" i18n>Registration</a>
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
    
    form {
      display: inline-flex;
      flex-wrap: wrap;
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
export class LoginComponent {
  form = {
    username: '',
    password: '',
    stayLoggedIn: false
  }
  inputFocus: Observable<boolean>;

  constructor(private userService: UserService, private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.inputFocus = this.store.select(getInputFocus);

    this.route.params.subscribe((params: Params) => {
      if (params['emailVerifCode'] && params['uid']) {
        this.userService.verifyEmail(params['emailVerifCode'], Number(params['uid'])).
        subscribe(
          res => alert('Email address successfully verified'),
          err => {
            switch (err.identifier) {
              case 'already-verified':
                alert('Email address already verified');
                break;
              case 'other-already-verified':
                alert('Someone else already verified this email address');
                break;
              default:
                /*alert('Verifying the email address failed');*/
                alert('Beim Bestätigen der E-Mail-Adresse ist ein Fehler aufgetreten. Bitte schreibe uns eine E-Mail an email@tradity.de (Betreff: Tradity2017). Wir bestätigen Deinen Account dann manuell. In der Zwischenzeit kannst Du bereits spielen. Viel Spaß!');
                break;
            }
          }
        );
      }
    })
  }

  updateForm(e) {
    this.form[e.target.name] = e.target.value;
  }
  
  submit(e) {
    e.preventDefault();
    this.store.dispatch(new authActions.Login({ username: this.form.username, password: this.form.password, stayLoggedIn: this.form.stayLoggedIn }));
  }

  resetPassword() {
    this.userService.resetPassword();
  }
}
