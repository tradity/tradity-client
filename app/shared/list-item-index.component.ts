import { Component, Input } from '@angular/core';

@Component({
  selector: 'tradity-li-index',
  styles: [`
    :host {
      position: absolute;
      left: -60px;
      border-radius: 50%;
      background-color: #283B90;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 7px;
      min-width: 6px;
    }
    
    span {
      font-size: 8px;
      font-weight: bold;
      line-height: 10px;
      color: white;
    }`],
  template: '<span>{{ index }}</span>'
})
export class ListItemIndexComponent {
  @Input() index: number;

  constructor() { }
}