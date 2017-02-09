import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  stayloggedin: boolean;
  
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { 
    this.stayloggedin = false;
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
                alert('Verifying the email address failed');
                break;
            }
          }
        );
      }
    })
  }
  
  login() {
    this.userService.login(this.username, this.password, this.stayloggedin).subscribe(result => {
      if (result) this.router.navigateByUrl('dashboard');
    })
  }

}