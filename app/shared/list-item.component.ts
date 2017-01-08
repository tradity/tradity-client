import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tradity-li',
  template: '<ng-content></ng-content>',
  styleUrls: ['app/shared/list-item.component.css']
})
export class ListItemComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}