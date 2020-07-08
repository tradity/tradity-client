import { Component, Input, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';

import * as appActions from '../app.actions';

@Component({
  selector: 'tradity-notification',
  styles: [`
    :host {
      display: flex;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.5);
    }
    
    :host[type=info] {
      background-color: #BDE5F8;
      color: #00529B;
    }
    
    :host[type=error] {
      background-color: #FFBABA;
      color: #D8000C;
    }
    
    :host[type=warning] {
      background-color: #FEEFB3;
      color: #9F6000;
    }
    
    :host[type=success] {
      background-color: #DFF2BF;
      color: #4F8A10;
    }
    
    span {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      letter-spacing: 2px;
      line-height: 15px;
      margin: 0 5px;
    }
    
    tradity-icon {
      font-size: 18px;
      margin: 0 5px;
    }`],
  template: '<tradity-icon>{{ icon }}</tradity-icon><span>{{ message }}</span><tradity-icon (click)="close()">close</tradity-icon>'
})
export class NotificationComponent {
  @HostBinding('attr.type') _type: string;
  @Input() id: number;
  @Input() message: string;
  @Input() set type(type: string) {
    this._type = type;
    switch (type) {
      case 'info':
      case 'warning':
      case 'error':
        this.icon = type;
        break;
      case 'success':
        this.icon = 'check_circle';
        break;
    }
  }
  icon: string;

  constructor(private store: Store<any>) {
    setTimeout(this.close.bind(this), 4000);
  }

  close() {
    this.store.dispatch(new appActions.CloseNotification(this.id));
  }
}