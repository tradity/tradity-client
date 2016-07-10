import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class GameComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}