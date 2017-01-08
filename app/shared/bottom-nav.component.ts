import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tradity-bottom-nav',
  template: '<ng-content></ng-content>',
  styleUrls: ['app/shared/bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}