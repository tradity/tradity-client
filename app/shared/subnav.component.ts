import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[tradity-subnav]',
  styleUrls: ['app/shared/subnav.component.css'],
  template: '<ng-content></ng-content>'
})
export class SubnavComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}