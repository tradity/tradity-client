import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-li-index',
  styleUrls: ['list-item-index.component.css'],
  template: '<span>{{ index }}</span>'
})
export class ListItemIndexComponent {
  @Input() index: number;

  constructor() { }
}