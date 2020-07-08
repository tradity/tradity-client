import { Component, Input } from '@angular/core';

@Component({
  selector: 'tradity-li-img',
  styleUrls: ['list-item-image.component.css'],
  template: '<img *ngIf="src" [src]="src" /><span *ngIf="!src">{{ placeholder.toUpperCase()[0] }}</span>'
})
export class ListItemImageComponent {
  @Input() src: string;
  @Input() placeholder = '';

  constructor() { }
}