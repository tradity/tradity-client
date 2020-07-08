import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { UserService } from '../core/user.service';
import * as authActions from './auth.actions';
import { getInputFocus } from '../app.reducer';

@Component({
  selector: 'tradity-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  inputFocus: Observable<boolean>;

  constructor(private userService: UserService, private store: Store<any>, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      stayLoggedIn: false
    });

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
  
  login() {
    this.store.dispatch(new authActions.Login(this.form.value));
  }

  resetPassword() {
    this.userService.resetPassword();
  }
}
