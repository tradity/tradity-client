import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav/sidenav';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';

import { UserService } from './user.service';
import { SearchComponent } from './search.component';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game.component.html',
  directives: [ROUTER_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdButton]
})
export class GameComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }
  
  logout() {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }

}