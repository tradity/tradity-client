import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as appActions from '../app.actions';

@Component({
  moduleId: module.id,
  selector: 'tradity-notification',
  styleUrls: ['notification.component.css'],
  template: '<tradity-icon>{{ icon }}</tradity-icon><span>{{ message }}</span><tradity-icon (click)="close()">close</tradity-icon>'
})
export class NotificationComponent {
  @Input() id: number;
  @Input() message: string;
  @Input() set type(type: string) {
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

  constructor(private store: Store<any>) {}

  close() {
    this.store.dispatch(new appActions.CloseNotification(this.id));
  }
}