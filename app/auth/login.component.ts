import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription'

import { UserService } from '../core/user.service';
import * as authActions from './auth.actions';
import { LoginFormState, getLoginForm } from './auth.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  formValues: LoginFormState;
  formValuesSub: Subscription;

  constructor(private userService: UserService, private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.formValuesSub = this.store.select(getLoginForm).subscribe(res => this.formValues = res);
  }

  ngOnInit() {
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
    this.store.dispatch(new authActions.Login());
  }

  updateForm(key: string, value: string | boolean) {
    this.store.dispatch(new authActions.UpdateLoginForm({ key, value }));
  }

  resetPassword() {
    this.userService.resetPassword();
  }

  ngOnDestroy() {
    this.formValuesSub.unsubscribe();
  }
}
