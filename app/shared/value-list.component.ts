import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-vl',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-basis: 100%;
      flex-wrap: wrap;
      background-color: #2B2D38;
      padding: 10px 0;
      margin: 0;
    }
  `]
})
export class ValueListComponent { }