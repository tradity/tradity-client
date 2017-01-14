import { Component, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-container',
  styleUrls: ['container.component.css'],
  template: '<ng-content></ng-content>'
})
export class ContainerComponent {  
  @HostBinding('class.active') isActive = false;

  constructor() { }

  onToggle() {
    this.isActive = this.isActive ? false : true;
  }
}