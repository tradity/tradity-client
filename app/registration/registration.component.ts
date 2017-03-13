import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../user.service';
import { GroupService } from '../group.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
  givenName: string;
  surname: string;
  city: string;
  school: string;
  class: string;

  private groupListSubscription: Subscription;
  groupList: any;
  subGroups: Array<any>;

  constructor(private router: Router, private userService: UserService, private groupService: GroupService) { }

  ngOnInit() {
    this.groupListSubscription = this.groupService.groupList
                                 // filter for top-level groups
                                 .map(res => res.filter(val => val.path.split('/').length - 1 === 1))
                                 .subscribe(res => this.groupList = res);
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
          this.router.navigateByUrl('/register/step2');
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
    this.userService.register({
      name: this.username,
      email: this.email,
      password: this.password,
      giv_name: this.givenName,
      fam_name: this.surname,
      school: this.school || null,
      schoolclass: this.class || null
    }).subscribe(result => {
      if (result) this.router.navigateByUrl('dashboard');
    })
  }

  resetPassword() {
    this.userService.resetPassword();
  }
}