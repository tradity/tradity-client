import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '[tradity-subnav]',
  styleUrls: ['subnav.component.css'],
  template: '<ng-content></ng-content>'
})
export class SubnavComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}