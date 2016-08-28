import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { UserService } from './user.service';
import { SearchComponent } from './search.component';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class GameComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }
  
  logout() {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }

}