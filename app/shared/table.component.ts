import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '[tradity-table]',
  styleUrls: ['table.component.css'],
  template: '<ng-content></ng-content>'
})
export class TableComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}