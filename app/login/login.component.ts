import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  
  constructor(private userService: UserService, private router: Router) { 
    this.stayloggedin = false;
  }

  ngOnInit() { }
  
  login() {
    this.userService.login(this.username, this.password, this.stayloggedin).subscribe(result => {
      if (result) this.router.navigateByUrl('dashboard');
    })
  }

}