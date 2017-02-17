import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-bottom-nav',
  template: '<ng-content></ng-content>',
  styleUrls: ['bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}