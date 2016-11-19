import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { SearchComponent } from '../search.component';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game/game.component.html',
  styleUrls: ['app/game/game.component.css']
})
export class GameComponent implements OnInit {
  private isMenuOpen = false;
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }
  
  logout() {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }
  
  toggleMenu() {
    if (this.isMenuOpen) this.isMenuOpen = false;
    else this.isMenuOpen = true; 
  }

}