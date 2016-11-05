import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[tradity-table]',
  styleUrls: ['app/table.component.css'],
  template: '<ng-content></ng-content>'
})
export class TableComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}