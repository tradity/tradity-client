import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-vl',
  template: '<ng-content></ng-content>',
  styles: [':host {display: flex; flex-wrap: wrap; flex-basis: 100%; }']
})
export class ListItemValueListComponent {
  constructor() { }
}