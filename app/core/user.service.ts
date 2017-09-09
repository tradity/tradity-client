import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService) { }

  verifyEmail(emailVerifCode: string, uid: number) {
    return this.apiService.post('/verify-email', {
      uid: uid,
      key: emailVerifCode
    })
    .map(res => res.json());
  }

  checkUsernameAndEmail(username: string, email: string) {
    return this.apiService.get('/validate-username/' + username)
    .map(res => res.json())
    .zip(
      this.apiService.get('/validate-email/' + email)
      .map(res => res.json())
    )
  }

  resetPassword() {
    let username: string = prompt('Bitte gib deinen Benutzernamen an:');
    if (username) {
      this.apiService.post('/reset-password', {
        name: username
      })
      .map(res => res.json())
      .subscribe(
        res => alert('Neues Passwort erfolgreich versandt'),
        err => {
          if (err.identifier === 'user-not-found') {
            alert('Der angegebene Benutzer existiert nicht');
          } else if (err.identifier === 'already-logged-in') {
            alert('Du bist bereits eingeloggt');
          } else {
            alert('Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
          }
        }
      );
    }
  }
}