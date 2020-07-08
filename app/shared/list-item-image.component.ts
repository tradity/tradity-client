import { Component, Input } from '@angular/core';

@Component({
  selector: 'tradity-li-img',
  styles: [`
    :host {
      position: absolute;
      width: 50px;
      height: 50px;
      left: -60px;
      border-radius: 50%;
      margin-top: 5px;
      background-color: rgba(23,8,4,0.02);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    
    span {
      font-weight: bold;
      font-size: 25px;
      line-height: 25px;
    }`],
  template: '<img *ngIf="src" [src]="src" /><span *ngIf="!src">{{ placeholder.toUpperCase()[0] }}</span>'
})
export class ListItemImageComponent {
  @Input() src: string;
  @Input() placeholder = '';

  constructor() { }
}