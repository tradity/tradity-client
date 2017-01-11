import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tradity-container',
  styleUrls: ['app/shared/container.component.css'],
  template: '<ng-content></ng-content>'
})
export class ContainerComponent {  
  @HostBinding('class.active') private isActive = false;

  constructor() { }

  onToggle() {
    this.isActive = this.isActive ? false : true;
  }
}